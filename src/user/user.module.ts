import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Module({
  providers: [UserResolver, UserService, FirebaseAdminService],
})
export class UserModule {}
