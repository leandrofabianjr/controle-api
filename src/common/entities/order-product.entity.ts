import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderItem {
  @ManyToOne(() => Order, (o) => o.items)
  @PrimaryColumn('uuid')
  order: Order;

  @ManyToOne(() => Product, (p) => p.orderItems)
  @PrimaryColumn('uuid')
  product: Product;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
