import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Product } from 'src/commons/entities/product.entity';
import { ServiceException } from 'src/commons/exceptions/service.exception';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
import { Raw, Repository } from 'typeorm';
import { ProductCreateDto } from './dto/product-create.dto';

export class ProductServiceException extends ServiceException {}
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  filter(options?: PaginatedServiceFilters<Product>): Promise<Product[]> {
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

  get(id: string): Promise<Product> {
    return this.repository.findOne(id);
  }

  async create(data: ProductCreateDto): Promise<Product> {
    const dto = new ProductCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = 'Por favor, confira os dados preenchidos';
      throw new ProductServiceException({ message, errors });
    }

    const products = await this.filter({
      name: dto.name,
    } as PaginatedServiceFilters<Product>);

    if (products.length > 0) {
      const message = 'Já existe um produto com o nome informado';
      throw new ProductServiceException({ message });
    }

    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async edit(id: string, data: ProductCreateDto) {
    const dto = new ProductCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = 'Por favor, confira os dados preenchidos';
      throw new ProductServiceException({ message, errors });
    }

    const products = await this.filter({
      name: dto.name,
    } as PaginatedServiceFilters<Product>);

    if (products.length > 0 && products.find((p) => p.id != id)) {
      const message = 'Já existe um produto com o nome informado';
      throw new ProductServiceException({ message });
    }

    const product = await this.get(id);

    if (!product) {
      const message = 'O produto não existe';
      throw new ProductServiceException({ message });
    }

    const entity = this.repository.create({ id, ...dto });
    return this.repository.save(entity);
  }
}
