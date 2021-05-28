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
} from '@nestjs/common';
import { Response } from 'express';
import ReturnMessage from 'src/common/utils/return-message';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { OrderCreateDto } from './dtos/order-create.dto';
import { OrderServiceException, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  @Get('')
  @Render('orders/index.hbs')
  async index(@Req() req) {
    const orders = await this.ordersService.filter();
    const context = req.flash('context')[0] || {};
    return { orders, ...context };
  }

  @Get('create')
  @Render('orders/create.hbs')
  async create(@Req() req) {
    const customers = await this.customersService.filter();
    const products = await this.productsService.filter();

    const context = req.flash('context')[0] || {};

    const itemsJson = await this.ordersService.getItemsJson(
      context?.dto?.products,
      context?.dto?.productsQuantities,
    );

    return { customers, products, itemsJson, ...context };
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
  @Render('orders/edit.hbs')
  async edit(@Param('id') id: string, @Req() req) {
    const order = await this.ordersService.get(id);
    if (!order) {
      throw new NotFoundException('Encomenda não encontrada');
    }
    const context = req.flash('context')[0] || {};

    const dto = context?.dto ?? OrderCreateDto.fromModel(order);
    const customers = await this.customersService.filter();
    const products = await this.productsService.filter();

    const itemsJson = await this.ordersService.getItemsJson(
      dto.products,
      dto.productsQuantities,
    );

    return { id: order.id, dto, customers, products, itemsJson, ...context };
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
