import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
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
import { ParsePaginatedSearchPipe } from 'src/commons/pipes/parse-paginated-search.pipe';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';

@UseFilters(AuthExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private resService: ResponseService,
    private customersService: CustomersService,
  ) {}

  @Get('')
  async filter(@Query(new ParsePaginatedSearchPipe()) params: PaginatedServiceFilters<) {
    params.sea
    return await this.customersService.filter(params);
  }

  @Post('')
  async store(
    @Body() body: CustomerCreateDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const customer = await this.customersService.create(body);
      return res.status(201).json(customer);
    } catch (ex) {
      console.error(ex);

      if (ex instanceof CustomerServiceException) {
        return res.status(400).json(ex.getContext());
      }

      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const customer = await this.customersService.get(id);
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return res.status(200).json(customer);
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
