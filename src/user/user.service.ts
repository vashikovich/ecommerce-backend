import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  private collection: FirebaseFirestore.CollectionReference;

  constructor(private firebaseAdminService: FirebaseService) {
    const db = this.firebaseAdminService.getFirestore();
    this.collection = db.collection('users');
  }

  async createUser(email: string, password?: string): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email,
    };

    if (password !== undefined) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    const doc = this.collection.doc(user.id);
    await doc.set(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const query = await this.collection.where('email', '==', email).get();
    return query.docs.map((doc) => doc.data() as User)[0];
  }

  async findById(id: string): Promise<User | undefined> {
    const doc = await this.collection.doc(id).get();
    return doc.data() as User;
  }

  async updateUser(
    id: string,
    input: UpdateUserInput,
  ): Promise<User | undefined> {
    const docRef = this.collection.doc(id);
    const userDoc = await docRef.get();
    const userData = userDoc.data();
    const user = { ...userData, ...input } as User;
    await docRef.set(user);
    return user;
  }
}
