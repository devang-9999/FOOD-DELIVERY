import { Authentication } from 'src/authentication/entities/authentication.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

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

  @ManyToOne(() => Authentication, (owner) => owner.restaurant, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  owner: Authentication;
}
