import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { FirebaseModule } from 'src/firebase/firebase.module.js';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [FirebaseModule],
})
export class OrderModule {}
