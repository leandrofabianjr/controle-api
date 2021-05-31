import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { OrderItem } from 'src/common/entities/order-item.entity';
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
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) {}

  filter(params?: any): Promise<Order[]> {
    return this.repository.find(params);
  }

  get(id: string): Promise<Order> {
    return this.repository.findOne(id);
  }

  async _saveOrder(dto: OrderCreateDto, entity: Order) {
    try {
      const order = await this.repository.save(entity);
      entity.items.forEach((i) => (i.order = order));
      entity.items = await this.orderItemRepository.save(entity.items);
      return order;
    } catch (ex) {
      console.error(ex);
      const message = ReturnMessage.Danger('Problema ao salvar a encomenda');
      throw new OrderServiceException({ message, dto });
    }
  }

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
    return this._saveOrder(dto, entity);
  }

  async edit(id: string, data: OrderCreateDto) {
    const dto = new OrderCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = ReturnMessage.Danger(
        'Por favor, confira os dados preenchidos',
      );
      throw new OrderServiceException({ message, dto, errors });
    }

    const order = await this.dtoToEntity(dto);
    order.id = id;

    order.items.forEach((i) => (i.order = order));

    return this._saveOrder(dto, order);
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

    order.dateToBeDone = new Date(dto.dateToBeDone);

    order.items = products.map((p, index) => {
      const orderitem = new OrderItem();
      orderitem.product = p;
      orderitem.quantity = +dto.productsQuantities[index];
      return orderitem;
    });

    return order;
  }

  async getItemsJson(
    productsIds: string[],
    quantities: number[],
  ): Promise<any> {
    let itemsJson: { id: string; name: string; quantity: number }[];

    if (Array.isArray(productsIds)) {
      const result = await this.productsService.filter({
        where: { id: In(productsIds) },
      });
      itemsJson = result.map((p) => {
        const index = productsIds.findIndex((pId) => pId == p.id);
        return { id: p.id, name: p.name, quantity: quantities[index] };
      });
    }

    return itemsJson;
  }
}
