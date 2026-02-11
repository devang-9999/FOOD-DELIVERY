import { Authentication } from 'src/authentication/entities/authentication.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
  })
  price: number;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column({ default: 'false' })
  isBanned: boolean;

  @Column()
  stock: number;

  @Column('text', {
    array: true,
    default: () => 'ARRAY[]::text[]',
  })
  images: string[];

  @ManyToOne(() => Authentication, (seller) => seller.dishes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sellerId' })
  seller: Authentication;
}
