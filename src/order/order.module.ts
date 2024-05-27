import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [FirebaseModule, CartModule, ProductModule],
})
export class OrderModule {}
