import { Module } from '@nestjs/common';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [CartResolver, CartService],
  imports: [FirebaseModule, UserModule],
})
export class CartModule {}
