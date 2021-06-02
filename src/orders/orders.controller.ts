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
import { AuthenticatedGuard } from 'src/commons/guards/authenticated.guard';
import { ResponseService } from 'src/commons/response/response.service';
import ReturnMessage from 'src/commons/utils/return-message';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { OrderCreateDto } from './dtos/order-create.dto';
import { OrderServiceException, OrdersService } from './orders.service';

@Controller('orders')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class OrdersController {
  constructor(
    private resService: ResponseService,
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  @Get('')
  async index(@Res() res) {
    const orders = await this.ordersService.filter();
    return this.resService.render(res, 'orders/index.hbs', { orders });
  }

  @Get('create')
  async create(@Req() req, @Res() res) {
    const customers = await this.customersService.filter();
    const products = await this.productsService.filter();

    const context = req.flash('context')[0] || {};

    const itemsJson = await this.ordersService.getItemsJson(
      context?.dto?.products,
      context?.dto?.productsQuantities,
    );

    return this.resService.render(res, 'orders/create.hbs', {
      customers,
      products,
      itemsJson,
      ...context,
    });
  }

  @Post('')
  async store(@Body() body: OrderCreateDto, @Res() res: Response, @Req() req) {
    let context = {};

    try {
      const order = await this.ordersService.create(body);
      const message = ReturnMessage.Success(
        `Emcomenda para "${order.customer.name}" criada com sucesso`,
      );
      context = { message };
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
    }

    req.flash('context', context);

    return res.redirect('/orders/create');
  }

  @Get(':id/edit')
  async edit(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const order = await this.ordersService.get(id);
    if (!order) {
      throw new NotFoundException('Encomenda não encontrada');
    }

    const context = req.flash('context')[0] || {};

    context.dto = context?.dto ?? OrderCreateDto.fromModel(order);
    const customers = await this.customersService.filter();
    const products = await this.productsService.filter();

    const itemsJson = await this.ordersService.getItemsJson(
      context?.dto?.products,
      context?.dto?.productsQuantities,
    );

    return this.resService.render(res, 'orders/edit.hbs', {
      id,
      customers,
      products,
      itemsJson,
      ...context,
    });
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
