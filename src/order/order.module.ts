import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [FirebaseModule, CartModule, ProductModule, EmailModule, UserModule],
})
export class OrderModule {}
