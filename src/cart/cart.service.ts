import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';

@Injectable()
export class CartService {
  private db: FirebaseFirestore.Firestore;

  constructor(private firebaseAdminService: FirebaseService) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async createCart(cart: CreateCartInput): Promise<Cart> {
    const cartRef = this.db.collection('carts').doc();
    const newCart = {
      id: cartRef.id,
      ...cart,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await cartRef.set(newCart);
    return newCart as Cart;
  }

  async getCartById(id: string): Promise<Cart> {
    const doc = await this.db.collection('carts').doc(id).get();
    return { id: doc.id, ...doc.data() } as Cart;
  }

  async getCartsByUserId(userId: string): Promise<Cart[]> {
    const snapshot = await this.db
      .collection('carts')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Cart);
  }
}
