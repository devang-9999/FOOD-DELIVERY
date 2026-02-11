/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(":userId")
  placeOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.placeOrder(dto.userId, dto);
  }

  @Get('my-orders/:userId')
  getMyOrders(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUser(+userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(Number(id), updateOrderDto);
  }
}
