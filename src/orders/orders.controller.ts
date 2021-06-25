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
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Order } from 'src/commons/entities/order.entity';
import { AuthExceptionFilter } from 'src/commons/filters/auth-exceptions.filter';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
import { ParsePaginatedSearchPipe } from 'src/commons/pipes/parse-paginated-search.pipe';
import { ResponseService } from 'src/commons/response/response.service';
import ReturnMessage from 'src/commons/utils/return-message';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { OrderCreateDto } from './dtos/order-create.dto';
import { OrderServiceException, OrdersService } from './orders.service';

@Controller('orders')
@UseFilters(AuthExceptionFilter)
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('')
  async filter(
    @Query(new ParsePaginatedSearchPipe())
    params: PaginatedServiceFilters<Order>,
  ) {
    console.log(params);
    return await this.ordersService.filter(params);
  }

  @Post('')
  async store(@Body() body: OrderCreateDto, @Res() res: Response, @Req() req) {
    try {
      const order = await this.ordersService.create(body);
      return res.status(201).json(order);
    } catch (ex) {
      console.error(ex);

      if (ex instanceof OrderServiceException) {
        return res.status(400).json(ex.getContext());
      }

      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  async edit(@Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.get(id);
    console.log('passou');
    console.log(order);
    if (!order) {
      throw new NotFoundException('Encomenda não encontrada');
    }
    console.log('finaliza');
    return res.json(order);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: OrderCreateDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.get(id);
    if (!order) {
      throw new NotFoundException('Encomenda não encontrada');
    }

    let context = {};

    try {
      const order = await this.ordersService.edit(id, body);
      const message = ReturnMessage.Success(
        `Emcomenda para "${order.customer.name}" criada com sucesso`,
      );
      context = { message };
      req.flash('context', context);
      return res.redirect('/orders');
    } catch (ex) {
      console.error(ex);
      if (ex instanceof OrderServiceException) {
        context = ex.getContext();
        console.log(context);
      } else {
        const message = ReturnMessage.Danger(
          'Não foi possível criar a encomenda',
        );
        context = { message };
      }
      req.flash('context', context);
      return res.redirect(`/orders/${id}/edit`);
    }
  }
}
