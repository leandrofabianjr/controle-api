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
import { Order } from 'src/commons/entities/order.entity';
import { AuthExceptionFilter } from 'src/commons/filters/auth-exceptions.filter';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
import { ParsePaginatedSearchPipe } from 'src/commons/pipes/parse-paginated-search.pipe';
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
    if (!order) {
      throw new NotFoundException();
    }
    return res.json(order);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: OrderCreateDto,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.get(id);
    if (!order) {
      throw new NotFoundException();
    }

    try {
      const order = await this.ordersService.edit(id, body);
      return res.json(order);
    } catch (ex) {
      console.error(ex);

      if (ex instanceof OrderServiceException) {
        return res.status(400).json(ex.getContext());
      }

      throw new InternalServerErrorException();
    }
  }
}
