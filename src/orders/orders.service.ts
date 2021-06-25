import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID, validate } from 'class-validator';
import { OrderItem } from 'src/commons/entities/order-item.entity';
import { Order } from 'src/commons/entities/order.entity';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import { PaginatedResponse } from 'src/commons/interfaces/paginated-response';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
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

  async filter(
    options?: PaginatedServiceFilters<Order>,
  ): Promise<PaginatedResponse<Order>> {
    const [data, total] = await this.repository.findAndCount(options);
    const res: PaginatedResponse<Order> = {
      data,
      total,
      limit: options?.take,
      offset: options?.skip,
    };
    return res;
  }

  get(id: string): Promise<Order> {
    if (!isUUID(id)) {
      console.log('não é uuid');
      return new Promise((resolve) => resolve(null));
    }
    console.log('é uuid');
    return this.repository.findOne(id);
  }

  async _saveOrder(dto: OrderCreateDto, entity: Order) {
    try {
      const order = await this.repository.save(entity);
      entity.items.forEach((i) => (i.order = order));
      entity.items = await this.orderItemRepository.save(entity.items);
      order.items.forEach((i) => (i.order = null));
      return order;
    } catch (ex) {
      console.error(ex);
      const message = 'Problema ao salvar a encomenda';
      throw new OrderServiceException({ message });
    }
  }

  async create(data: OrderCreateDto): Promise<Order> {
    const dto = new OrderCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = 'Por favor, confira os dados preenchidos';
      throw new OrderServiceException({ message, errors });
    }

    const entity = await this.dtoToEntity(dto);
    return this._saveOrder(dto, entity);
  }

  async edit(id: string, data: OrderCreateDto) {
    const dto = new OrderCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = 'Por favor, confira os dados preenchidos';
      throw new OrderServiceException({ message, errors });
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
      const message = 'O cliente informado não existe';
      throw new OrderServiceException({ message });
    }
    order.customer = customer;

    const products = await this.productsService.filter({
      where: { id: In(dto.items.map((i) => i.product)) },
    });

    if (products.length != dto.items?.length) {
      const message = 'Algum dos produtos não existe';
      throw new OrderServiceException({ message });
    }

    const dateToBeDone = new Date(dto.dateToBeDone);
    dateToBeDone.setHours(0, 0, 0);
    dateToBeDone.setDate(dateToBeDone.getDate() + 1);
    order.dateToBeDone = dateToBeDone;

    order.items = dto.items.map((item) => {
      const orderitem = new OrderItem();
      orderitem.product = products.find((p) => p.id == item.product);
      orderitem.quantity = +item.quantity;
      return orderitem;
    });

    return order;
  }
}
