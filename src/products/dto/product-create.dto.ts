import { IsNotEmpty } from 'class-validator';
import ValidationMessages from 'src/common/validation-messages';

export class ProductCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  name: string;

  constructor(data: ProductCreateDto) {
    this.name = data.name;
  }
}
