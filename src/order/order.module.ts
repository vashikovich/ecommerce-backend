import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  providers: [OrderResolver, OrderService, FirebaseService],
})
export class OrderModule {}
