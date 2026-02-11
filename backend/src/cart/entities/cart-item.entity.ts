/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Cart } from "./cart.entity";
import { Dish } from "src/dishes/entities/dish.entity";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: "CASCADE",
  })
  cart: Cart;

  @ManyToOne(() => Dish, { eager: true })
  product: Dish;

  @Column()
  quantity: number;
}