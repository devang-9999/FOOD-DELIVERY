import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Authentication } from 'src/authentication/entities/authentication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Dish, Authentication])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
