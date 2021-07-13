import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/commons/entities/customer.entity';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import { BaseService } from 'src/commons/services/base/base.service';
import { DeepPartial, Repository } from 'typeorm';
import { CustomerCreateDto } from './dtos/customer.dto';

export class CustomerServiceException extends ServiceException {}

@Injectable()
export class CustomersService extends BaseService<Customer, CustomerCreateDto> {
  constructor(@InjectRepository(Customer) repository: Repository<Customer>) {
    super(repository);
  }

  buildDto(data: CustomerCreateDto): CustomerCreateDto {
    return new CustomerCreateDto(data);
  }

  buildPartial(dto: CustomerCreateDto): DeepPartial<Customer> {
    return dto;
  }
}
