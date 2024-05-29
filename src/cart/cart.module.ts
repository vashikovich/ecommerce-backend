import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ProductModule } from 'src/product/product.module';
import { CartItemResolver } from './cart-item.resolver';

@Module({
  providers: [CartResolver, CartItemResolver, CartService],
  imports: [FirebaseModule, ProductModule],
  exports: [CartService],
})
export class CartModule {}
