import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/create-cart.dto';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Authentication } from 'src/authentication/entities/authentication.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Dish)
    private readonly productsRepo: Repository<Dish>,

    @InjectRepository(Authentication)
    private readonly userRepo: Repository<Authentication>,
  ) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productsRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
    } else {
      const cartItem = this.cartItemRepo.create({
        product,
        quantity: dto.quantity,
      });
      cart.items.push(cartItem);
    }

    return this.cartRepo.save(cart);
  }

  async getMyCart(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      return { items: [] };
    }

    return cart;
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) throw new BadRequestException('Cart not found');

    cart.items = cart.items.filter((item) => item.product.id !== productId);

    return this.cartRepo.save(cart);
  }

  async clearCart(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!cart) return;

    await this.cartRepo.remove(cart);
  }
}
