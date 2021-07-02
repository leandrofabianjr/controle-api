import { IsNotEmpty } from 'class-validator';
import ValidationMessages from 'src/commons/validation-messages';

export class OrderItemCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  product: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  quantity: number;

  constructor(data: OrderItemCreateDto) {
    this.product = data.product;
    this.quantity = data.quantity;
  }
}
