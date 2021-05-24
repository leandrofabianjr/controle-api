import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/common/entities/product.entity';
import ValidationMessages from 'src/common/validation-messages';

export class ProductCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  name: string;

  constructor(data: ProductCreateDto) {
    this.name = data.name;
  }

  static fromModel(model: Product): ProductCreateDto {
    return new this(model);
  }
}
