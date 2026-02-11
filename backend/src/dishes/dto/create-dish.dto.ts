import { IsNumber, IsString } from 'class-validator';

export class CreateDishDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsString()
  brand: string;

  @IsNumber()
  stock: number;

  @IsNumber()
  sellerId: number;
}
