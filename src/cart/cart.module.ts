import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  providers: [CartResolver, CartService, FirebaseService],
})
export class CartModule {}
