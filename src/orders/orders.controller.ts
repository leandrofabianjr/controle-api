import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { json, Response } from 'express';
import ReturnMessage from 'src/common/utils/return-message';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { In } from 'typeorm';
import { OrderCreateDto } from './dtos/order-create.dto';
import { OrderServiceException, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  @Get('create')
  @Render('orders/create.hbs')
  async create(@Req() req) {
    const customers = await this.customersService.filter();
    const products = await this.productsService.filter();

    const context = req.flash('context')[0] || {};

    const productsIds = context?.dto?.products;
    let itemsJson;
    if (Array.isArray(productsIds)) {
      const result = await this.productsService.filter({
        where: { id: In(productsIds) },
      });
      const quantities = context?.dto?.productsQuantities;
      itemsJson = result.map((p) => {
        const index = productsIds.findIndex((pId) => pId == p.id);
        return { id: p.id, name: p.name, quantity: quantities[index] };
      });
    }
    return {
      customers,
      products,
      itemsJson: JSON.stringify(itemsJson),
      ...context,
    };
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
}
