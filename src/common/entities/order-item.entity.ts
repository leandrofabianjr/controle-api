import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderItem {
  @ManyToOne(() => Order, (o) => o.items, { primary: true })
  order: Order;

  @ManyToOne(() => Product, (p) => p.orderItems, { primary: true, eager: true })
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
