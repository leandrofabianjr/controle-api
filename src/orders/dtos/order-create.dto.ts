import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/common/entities/order.entity';
import ValidationMessages from 'src/common/validation-messages';
import { MatchLenght } from 'src/common/match-lenght.decorator';

export class OrderCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Cliente') })
  customer: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  products: string[];

  @MatchLenght('products')
  productsQuantities: number[];

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  dateToBeDone: Date;

  constructor(data: OrderCreateDto) {
    this.customer = data.customer;
    this.products = data.products;
    this.productsQuantities = data.productsQuantities.map((q) => +q);
    this.dateToBeDone = data.dateToBeDone;
  }

  static fromModel(model: Order): OrderCreateDto {
    return new this({
      customer: model.customer?.id,
      products: model.items?.map((i) => i.product?.id),
      productsQuantities: model.items?.map((i) => +i.quantity),
      dateToBeDone: model.dateToBeDone,
    } as OrderCreateDto);
  }
}
