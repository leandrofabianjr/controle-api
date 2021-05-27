import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { OrderItem } from 'src/common/entities/order-product.entity';
import { Order } from 'src/common/entities/order.entity';
import { ServiceException } from 'src/common/exceptions/service.exception';
import ReturnMessage from 'src/common/utils/return-message';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { In, Repository } from 'typeorm';
import { OrderCreateDto } from './dtos/order-create.dto';

export class OrderServiceException extends ServiceException {}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  async create(data: OrderCreateDto): Promise<Order> {
    const dto = new OrderCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = ReturnMessage.Danger(
        'Por favor, confira os dados preenchidos',
      );
      throw new OrderServiceException({ message, dto, errors });
    }

    const entity = await this.dtoToEntity(dto);

    return this.repository.save(entity);
  }

  async dtoToEntity(dto: OrderCreateDto): Promise<Order> {
    const order = new Order();

    const customer = await this.customersService.get(dto.customer);
    if (!customer) {
      const message = ReturnMessage.Danger('O cliente informado não existe');
      throw new OrderServiceException({ message, dto });
    }
    order.customer = customer;

    const products = await this.productsService.filter({
      where: { id: In(dto.products) },
    });
    if (products.length != dto.products?.length) {
      const message = ReturnMessage.Danger('Algum dos produtos não existe');
      throw new OrderServiceException({ message, dto });
    }

    if (dto.products?.length != dto.productsQuantities.length) {
      const message = ReturnMessage.Danger(
        'Cada produto deve ter uma quantidade',
      );
      throw new OrderServiceException({ message, dto });
    }

    order.items = products.map((p, index) => {
      const orderitem = new OrderItem();
      orderitem.product = p;
      orderitem.quantity = +dto.productsQuantities[index];
      return orderitem;
    });

    order.dateToBeDone = dto.dateToBeDone;
    return order;
  }
}
