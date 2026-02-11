/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentStatus, DeliveryStatus } from './enums/order-status.enum';
import { Cart } from 'src/cart/entities/cart.entity';
import { Orders } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(Orders)
    private readonly ordersRepo: Repository<Orders>,
  ) {}

  async placeOrder(userId: number, dto: CreateOrderDto) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = this.ordersRepo.create({
      user: cart.user,
      items: orderItems,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
      paymentStatus: PaymentStatus.AWAITING,
      deliveryStatus: DeliveryStatus.TO_BE_SHIPPED,
    });
    cart.items = [];
    await this.cartRepo.save(cart);

    return this.ordersRepo.save(order);
  }

  async getOrdersByUser(userId: number) {
    return this.ordersRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: number, dto: UpdateOrderStatusDto) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (dto.paymentStatus) {
      order.paymentStatus = dto.paymentStatus;
    }

    if (dto.deliveryStatus) {
      order.deliveryStatus = dto.deliveryStatus;
    }

    return this.ordersRepo.save(order);
  }
}
