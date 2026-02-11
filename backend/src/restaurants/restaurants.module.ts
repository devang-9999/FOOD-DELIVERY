import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurants.service';
import { RestaurantController } from './restaurants.controller';
import { Restaurant } from './entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantsModule {}
