import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Customer } from 'src/commons/entities/customer.entity';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated_service_filters';
import ReturnMessage from 'src/commons/utils/return-message';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { CustomerCreateDto } from './dtos/customer.dto';

export class CustomerServiceException extends ServiceException {}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repository: Repository<Customer>,
  ) {}

  filter(options?: PaginatedServiceFilters<Customer>): Promise<Customer[]> {
    if (options?.search?.length) {
      options.where = {
        name: Raw((v) => `LOWER(${v}) Like LOWER(:value)`, {
          value: `%${options.search}%`,
        }),
      };
      delete options.search;
    }

    return this.repository.find(options);
  }

  get(id: string): Promise<Customer> {
    return this.repository.findOne(id);
  }

  async create(data: CustomerCreateDto): Promise<Customer> {
    const dto = new CustomerCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = ReturnMessage.Danger(
        'Por favor, confira os dados preenchidos',
      );
      throw new CustomerServiceException({ message, errors });
    }

    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async edit(id: string, data: CustomerCreateDto) {
    const dto = new CustomerCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = ReturnMessage.Danger(
        'Por favor, confira os dados preenchidos',
      );
      throw new CustomerServiceException({ message, errors });
    }

    const customer = await this.get(id);

    if (!customer) {
      const message = ReturnMessage.Danger('O cliente não existe');
      throw new CustomerServiceException({ message });
    }

    const entity = this.repository.create({ id, ...dto });
    return this.repository.save(entity);
  }
}
