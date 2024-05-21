import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Module({
  providers: [CartResolver, CartService, FirebaseAdminService],
})
export class CartModule {}