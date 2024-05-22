import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [UserService, UserResolver],
  imports: [FirebaseModule],
})
export class UserModule {}
