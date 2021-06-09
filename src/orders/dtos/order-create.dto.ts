import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { Order } from 'src/commons/entities/order.entity';
import ValidationMessages from 'src/commons/validation-messages';
import { MatchLenght } from 'src/commons/match-lenght.decorator';
import { Type, plainToClass } from 'class-transformer';
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

  static fromModel(model: Order): OrderCreateDto {
    return new this({
      customer: model.customer?.id,
      items: model.items?.map((item) => OrderItemCreateDto.fromModel(item)),
      dateToBeDone: model.dateToBeDone?.toISOString()?.substring(0, 10),
    } as OrderCreateDto);
  }
}
