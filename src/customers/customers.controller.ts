import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthExceptionFilter } from 'src/commons/filters/auth-exceptions.filter';
import ReturnMessage from 'src/commons/utils/return-message';
import { ResponseService } from 'src/commons/response/response.service';
import {
  CustomerServiceException,
  CustomersService,
} from './customers.service';
import { CustomerCreateDto } from './dtos/customer.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';

@UseFilters(AuthExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private resService: ResponseService,
    private customersService: CustomersService,
  ) {}

  @Get('')
  async index() {
    console.log('listando');
    return await this.customersService.filter();
  }

  @Get(':id/edit')
  async edit(@Param('id') id: string, @Res() res) {
    const customer = await this.customersService.get(id);
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const dto = CustomerCreateDto.fromModel(customer);

    return this.resService.render(res, 'customers/edit.hbs', { id, dto });
  }

  @Get('create')
  create(@Res() res) {
    return this.resService.render(res, 'customers/create.hbs');
  }

  @Post('')
  async store(
    @Body() body: CustomerCreateDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const customer = await this.customersService.create(body);
      res.status(201).json(customer);
    } catch (ex) {
      console.error(ex);
      res.status(400);

      if (ex instanceof CustomerServiceException) {
        res.json(ex.getContext());
      } else {
        const message = 'Erro desconhecido';
        res.json({ message });
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: CustomerCreateDto,
    @Req() req,
    @Res() res: Response,
  ) {
    let context = {};
    try {
      const customer = await this.customersService.edit(id, body);
      const message = ReturnMessage.Success(
        `Cliente "${customer.name}" editado com sucesso`,
      );
      context = { message };
      return res.redirect('/customers');
    } catch (ex) {
      console.error(ex);
      if (ex instanceof CustomerServiceException) {
        context = ex.getContext();
      } else {
        const message = ReturnMessage.Danger(
          'Não foi possível editar o cliente',
        );
        context = { message };
      }
      req.flash('context', context);
      return res.redirect(`/customers/${id}/edit`);
    }
  }
}
