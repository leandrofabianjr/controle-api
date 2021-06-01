import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import ReturnMessage from 'src/common/utils/return-message';
import {
  CustomerServiceException,
  CustomersService,
} from './customers.service';
import { CustomerCreateDto } from './dtos/customer.dto';

@Controller('customers')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('')
  @Render('customers/index.hbs')
  async index() {
    const customers = await this.customersService.filter();

    return { customers };
  }

  @Get(':id/edit')
  @Render('customers/edit.hbs')
  async edit(@Param('id') id: string) {
    const customer = await this.customersService.get(id);
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return { id: customer.id, dto: CustomerCreateDto.fromModel(customer) };
  }

  @Get('create')
  @Render('customers/create.hbs')
  create() {
    return {};
  }

  @Post('')
  @Render('customers/create.hbs')
  async store(@Body() body: CustomerCreateDto) {
    let context = {};

    try {
      const customer = await this.customersService.create(body);
      const message = ReturnMessage.Success(
        `Cliente "${customer.name}" criado com sucesso`,
      );
      context = { message };
    } catch (ex) {
      console.error(ex);
      if (ex instanceof CustomerServiceException) {
        context = ex.getContext();
      } else {
        const message = ReturnMessage.Danger(
          'Não foi possível criar o cliente',
        );
        context = { message };
      }
    }

    return context;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: CustomerCreateDto,
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
      return res.render('customers/edit.hbs', context);
    }
  }
}
