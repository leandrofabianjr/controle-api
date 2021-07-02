import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import ValidationMessages from 'src/commons/validation-messages';
import { Type } from 'class-transformer';
import { OrderItemCreateDto } from './order-item-create.dto';

export class OrderCreateDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Cliente') })
  customer: string;

  @ValidateNested({ each: true })
  @Type(() => OrderItemCreateDto)
  @ArrayNotEmpty({ message: ValidationMessages.isNotEmpty() })
  items: OrderItemCreateDto[] | string[];

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty() })
  dateToBeDone: string;

  constructor(data: OrderCreateDto) {
    this.customer = data.customer;
    this.items = data.items?.map((itemStr) => {
      const item = typeof itemStr == 'string' ? JSON.parse(itemStr) : itemStr;
      return new OrderItemCreateDto({
        product: item?.product,
        productName: item?.productName,
        quantity: item?.quantity,
      } as OrderItemCreateDto);
    });
    this.dateToBeDone = data.dateToBeDone;
  }
}
