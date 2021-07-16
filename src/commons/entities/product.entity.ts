import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum UnitOfMeasurement {
  un = 'un',
  g = 'g',
  kg = 'kg',
  ml = 'ml',
  l = 'l',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UnitOfMeasurement,
    default: UnitOfMeasurement.un,
  })
  unitOfMeasurement: UnitOfMeasurement;

  @OneToMany(() => OrderItem, (oi) => oi.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
