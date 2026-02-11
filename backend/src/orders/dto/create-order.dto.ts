import { IsNumber, IsString, Max } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsString()
  address: string;

  @IsNumber()
  @Max(10, { message: 'Number cannot be greater than 10' })
  phoneNumber: string;

  @IsString()
  paymentMethod: 'COD' | 'ONLINE';
}
