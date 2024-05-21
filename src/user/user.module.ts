import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  providers: [UserResolver, UserService, FirebaseService],
})
export class UserModule {}
