import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Auth } from 'firebase-admin/lib/auth/auth';

@Injectable()
export class UserService {
  private auth: Auth;

  constructor(private firebaseAdminService: FirebaseService) {
    this.auth = firebaseAdminService.getAuth();
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async validateToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const decodedToken = await this.verifyToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  }
}
