import { IsNotEmpty } from 'class-validator';
import ValidationMessages from 'src/commons/validation-messages';

export class CustomerCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  name: string;

  address: string;

  phone: string;

  constructor(obj: CustomerCreateDto) {
    this.name = obj.name;
    this.address = obj.address;
    this.phone = obj.phone;
  }
}
