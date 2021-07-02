import { IsNotEmpty } from 'class-validator';
import ValidationMessages from 'src/commons/validation-messages';

export class ProductCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  name: string;

  constructor(data: ProductCreateDto) {
    this.name = data.name;
  }
}
