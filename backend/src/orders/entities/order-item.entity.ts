import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from './order.entity';
import { Dish } from 'src/dishes/entities/dish.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orders, (order) => order.items)
  order: Orders;

  @ManyToOne(() => Dish)
  product: Dish;

  @Column()
  quantity: number;

  @Column({
    type: 'decimal',
    default: 0,
  })
  price: number;
}
