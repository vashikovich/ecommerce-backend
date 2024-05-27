import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  private db: FirebaseFirestore.Firestore;
  private collection: FirebaseFirestore.CollectionReference;

  constructor(private firebaseAdminService: FirebaseService) {
    this.db = this.firebaseAdminService.getFirestore();
    this.collection = this.db.collection('carts');
  }

  async createCartIfNotExist(userId: string): Promise<Cart> {
    const cartRef = this.collection.doc();
    const newCart: Cart = {
      userId,
      items: [],
    };
    await cartRef.set(newCart);
    return newCart;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const doc = await this.collection.doc(userId).get();
    return doc.data() as Cart;
  }

  async addProductToCart(userId: string, productId: string): Promise<Cart> {
    const collection = this.collection;
    const doc = await collection.doc(userId).get();

    let cart: Cart;
    if (doc.exists) {
      cart = doc.data() as Cart;
    } else {
      cart = await this.createCartIfNotExist(userId);
    }

    const item = cart.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity++;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await collection.doc(userId).set(cart);

    return cart;
  }

  async changeCartProductQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const collection = this.collection;
    const doc = await collection.doc(userId).get();

    const cart = doc.data() as Cart;
    const item = cart.items.find((i) => i.productId === productId);
    item.quantity = quantity;

    await collection.doc(userId).set(cart);

    return cart;
  }
}
