import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source/data-source';
import { AuthenticationModule } from './authentication/authentication.module';
import { DishesModule } from './dishes/dishes.module';
import { CartModule } from './cart/cart.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions }),
    AuthenticationModule,
    DishesModule,
    CartModule,
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
