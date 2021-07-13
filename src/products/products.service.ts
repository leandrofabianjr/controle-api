import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/commons/entities/product.entity';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
import { BaseService } from 'src/commons/services/base/base.service';
import { DeepPartial, Repository } from 'typeorm';
import { ProductCreateDto } from './dto/product-create.dto';

@Injectable()
export class ProductsService extends BaseService<Product, ProductCreateDto> {
  constructor(@InjectRepository(Product) repository: Repository<Product>) {
    super(repository);
  }

  async buildDto(data: ProductCreateDto): Promise<ProductCreateDto> {
    return new ProductCreateDto(data);
  }
  async buildPartial(dto: ProductCreateDto): Promise<DeepPartial<Product>> {
    return dto;
  }

  private async validateBefore(dto: ProductCreateDto, id: string = null) {
    const products = await this.filter({
      name: dto.name,
    } as PaginatedServiceFilters<Product>);

    if (products.length > 0 && products.find((p) => p.id != id)) {
      return 'Já existe um produto com o nome informado';
    }

    return null;
  }

  validateBeforeEdit(id: string, dto: ProductCreateDto): Promise<string> {
    return this.validateBefore(dto, id);
  }

  validateBeforeCredit(dto: ProductCreateDto): Promise<string> {
    return this.validateBefore(dto);
  }
}
