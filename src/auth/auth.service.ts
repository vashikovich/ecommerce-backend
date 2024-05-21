import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Auth } from 'firebase-admin/lib/auth/auth';

@Injectable()
export class AuthService {
  private auth: Auth;

  constructor(private firebaseAdminService: FirebaseService) {
    this.auth = firebaseAdminService.getAuth();
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await this.auth.createUser({
        email,
        password,
      });
      return userCredential;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.auth.getUserByEmail(email);
      const token = await this.auth.createCustomToken(user.uid);
      return { user, token };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await this.firebaseAdminService.verifyIdToken(token);
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
