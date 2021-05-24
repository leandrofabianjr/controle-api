import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Customer } from 'src/common/entities/customer.entity';
import { ServiceException } from 'src/common/exceptions/service.exception';
import ReturnMessage from 'src/common/utils/return-message';
import { Repository } from 'typeorm';
import { CustomerCreateDto } from './dtos/customer.dto';

export class CustomerServiceException extends ServiceException {}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repository: Repository<Customer>,
  ) {}

  filter(params?: { name?: string }): Promise<Customer[]> {
    return this.repository.find(params);
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
      throw new CustomerServiceException({ message, dto, errors });
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
      throw new CustomerServiceException({ message, dto, errors });
    }

    const customer = await this.get(id);

    if (!customer) {
      const message = ReturnMessage.Danger('O cliente não existe');
      throw new CustomerServiceException({ dto, message });
    }

    const entity = this.repository.create({ id, ...dto });
    return this.repository.save(entity);
  }
}
