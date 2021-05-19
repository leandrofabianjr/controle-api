import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Product } from 'src/common/entities/product.entity';
import { ServiceException } from 'src/common/exceptions/service.exception';
import ReturnMessage from 'src/common/utils/return-message';
import { Repository } from 'typeorm';
import { ProductCreateDto } from './dto/product-create.dto';

export class ProductServiceException extends ServiceException {}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  filter(params?: { name?: string }): Promise<Product[]> {
    return this.repository.find(params);
  }

  get(id: string): Promise<Product> {
    return this.repository.findOne(id);
  }

  async create(data: ProductCreateDto): Promise<Product> {
    const dto = new ProductCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = ReturnMessage.Danger(
        'Por favor, confira os dados preenchidos',
      );
      throw new ProductServiceException({ message, dto, errors });
    }

    const products = await this.filter({ name: dto.name });

    if (products.length > 0) {
      const message = ReturnMessage.Danger(
        'Já existe um produto com o nome informado',
      );
      throw new ProductServiceException({ dto, message });
    }

    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async edit(id: string, data: ProductCreateDto) {
    const dto = new ProductCreateDto(data);
    const errors = await validate(dto);

    if (errors.length) {
      const message = ReturnMessage.Danger(
        'Por favor, confira os dados preenchidos',
      );
      throw new ProductServiceException({ message, dto, errors });
    }

    const products = await this.filter({ name: dto.name });

    if (products.length > 0 && products.find((p) => p.id != id)) {
      const message = ReturnMessage.Danger(
        'Já existe um produto com o nome informado',
      );
      throw new ProductServiceException({ dto, message });
    }

    const product = await this.get(id);

    if (!product) {
      const message = ReturnMessage.Danger('O produto não existe');
      throw new ProductServiceException({ dto, message });
    }

    const entity = this.repository.create({ id, ...dto });
    return this.repository.save(entity);
  }
}
