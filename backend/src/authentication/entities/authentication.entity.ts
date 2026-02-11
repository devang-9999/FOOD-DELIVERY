import { Dish } from 'src/dishes/entities/dish.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class Authentication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  role: string;

  @Column({ default: 'false' })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Dish, (dishes) => dishes.seller)
  dishes: Dish[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];
}
