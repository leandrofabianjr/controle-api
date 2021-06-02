import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/commons/entities/order.entity';
import ValidationMessages from 'src/commons/validation-messages';
import { MatchLenght } from 'src/commons/match-lenght.decorator';

export class OrderCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Cliente') })
  customer: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  products: string[];

  @MatchLenght('products')
  productsQuantities: number[];

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  dateToBeDone: string;

  constructor(data: OrderCreateDto) {
    this.customer = data.customer;
    this.products = data.products;
    this.productsQuantities = data.productsQuantities;
    this.dateToBeDone = data.dateToBeDone;
  }

  static fromModel(model: Order): OrderCreateDto {
    console.log(model.dateToBeDone?.toISOString());
    return new this({
      customer: model.customer?.id,
      products: model.items?.map((i) => i.product?.id),
      productsQuantities: model.items?.map((i) => +i.quantity),
      dateToBeDone: model.dateToBeDone?.toISOString()?.substring(0, 10),
    } as OrderCreateDto);
  }
}
