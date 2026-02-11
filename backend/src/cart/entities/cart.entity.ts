/* eslint-disable prettier/prettier */
import {
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Authentication } from "src/authentication/entities/authentication.entity";
import { CartItem } from "./cart-item.entity";


@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Authentication, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Authentication;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];
}