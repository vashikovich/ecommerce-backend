import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [CartResolver, CartService],
  imports: [FirebaseModule],
})
export class CartModule {}
