import { IsNotEmpty } from 'class-validator';
import ValidationMessages from 'src/commons/validation-messages';
import { OrderItem } from 'src/commons/entities/order-item.entity';

export class OrderItemCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  product: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  quantity: number;

  constructor(data: OrderItemCreateDto) {
    this.product = data.product;
    this.quantity = data.quantity;
  }

  static fromModel(model: OrderItem): OrderItemCreateDto {
    return new this({
      product: model.product.id,
      productName: model.product.name,
      quantity: model.quantity,
    } as OrderItemCreateDto);
  }
}
