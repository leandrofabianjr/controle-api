import { IsNotEmpty } from 'class-validator';
import { UnitOfMeasurement as UnitOfMeasurement } from 'src/commons/entities/product.entity';
import ValidationMessages from 'src/commons/validation-messages';

export class ProductCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  name: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Unidade de medida') })
  unitOfMeasurement: UnitOfMeasurement;

  constructor(data: ProductCreateDto) {
    this.name = data.name;
    this.unitOfMeasurement = data.unitOfMeasurement;
  }
}
