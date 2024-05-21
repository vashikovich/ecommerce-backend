import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Module({
  providers: [OrderResolver, OrderService, FirebaseAdminService],
})
export class OrderModule {}
