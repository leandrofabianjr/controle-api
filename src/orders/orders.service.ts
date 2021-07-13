import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { OrderItem } from 'src/commons/entities/order-item.entity';
import { Order } from 'src/commons/entities/order.entity';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import { BaseService } from 'src/commons/services/base/base.service';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { In, Repository } from 'typeorm';
import { OrderCreateDto } from './dtos/order-create.dto';

@Injectable()
export class OrdersService extends BaseService<Order, OrderCreateDto> {
  constructor(
    @InjectRepository(Order) repository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {
    super(repository);
  }

  async save(model: Order): Promise<Order> {
    const order = await this.repository.save(model);
    model.items.forEach((i) => (i.order = order));
    model.items = await this.orderItemRepository.save(model.items);
    order.items.forEach((i) => (i.order = null));
    return order;
  }

  async buildPartial(dto: OrderCreateDto): Promise<Order> {
    const order = new Order();

    const customer = await this.customersService.get(dto.customer);
    if (!customer) {
      const message = 'O cliente informado não existe';
      throw new ServiceException({ message });
    }
    order.customer = customer;

    const products = await this.productsService.filter({
      where: { id: In(dto.items.map((i) => i.product)) },
    });

    if (products.length != dto.items?.length) {
      const message = 'Algum dos produtos não existe ou está repetido';
      throw new ServiceException({ message });
    }

    const dateToBeDone = new Date(dto.dateToBeDone);
    dateToBeDone.setHours(0, 0, 0);
    order.dateToBeDone = dateToBeDone;

    order.items = dto.items.map((item) => {
      const orderitem = new OrderItem();
      orderitem.product = products.find((p) => p.id == item.product);
      orderitem.quantity = +item.quantity;
      return orderitem;
    });

    return order;
  }

  async buildDto(data: OrderCreateDto): Promise<OrderCreateDto> {
    return new OrderCreateDto(data);
  }
}
