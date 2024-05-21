import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private db;

  constructor(private firebaseAdminService: FirebaseService) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async createUser(email: string): Promise<User> {
    const userRef = this.db.collection('users').doc();
    const user = {
      uid: userRef.uid,
      id: userRef.id,
      email,
    };
    await userRef.set(user);
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const doc = await this.db.collection('users').doc(id).get();
    return { id: doc.id, ...doc.data() } as User;
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.db.collection('users').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User);
  }
}
