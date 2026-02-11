/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';


import { PaymentStatus, DeliveryStatus } from '../../orders/enums/order-status.enum';
import { Authentication } from 'src/authentication/entities/authentication.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Authentication, (user) => user.orders)
  user: Authentication;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.AWAITING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.TO_BE_SHIPPED,
  })
  deliveryStatus: DeliveryStatus;

  @CreateDateColumn()
  createdAt: Date;
}