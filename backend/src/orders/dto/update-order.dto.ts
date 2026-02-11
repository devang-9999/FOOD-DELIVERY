import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryStatus, PaymentStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  deliveryStatus?: DeliveryStatus;
}
