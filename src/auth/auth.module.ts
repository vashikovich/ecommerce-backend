import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [AuthService, AuthResolver],
  imports: [FirebaseModule]
})
export class AuthModule {}
