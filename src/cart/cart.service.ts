import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Cart } from './entities/cart.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  private db: FirebaseFirestore.Firestore;
  private collection: FirebaseFirestore.CollectionReference;

  constructor(
    private firebaseAdminService: FirebaseService,
    private productService: ProductService,
  ) {
    this.db = this.firebaseAdminService.getFirestore();
    this.collection = this.db.collection('carts');
  }

  async resetCart(userId: string): Promise<Cart> {
    const cartRef = this.collection.doc(userId);
    const newCart: Cart = {
      userId,
      items: [],
    };
    await cartRef.set(newCart);
    return newCart;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const doc = await this.collection.doc(userId).get();
    const cart = (doc.data() as Cart) ?? {
      userId,
      items: [],
    };
    return cart;
  }

  async changeCartProductQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const collection = this.collection;
    const doc = await collection.doc(userId).get();

    const product = await this.productService.getProductById(productId);

    const cart = doc.exists
      ? (doc.data() as Cart)
      : await this.resetCart(userId);
    const item = cart.items.find((i) => i.productId === productId);
    if (quantity > product.stock) {
      throw new BadRequestException('Product stock is not sufficient');
    }

    if (!item) {
      cart.items.push({ productId, quantity });
    } else if (quantity == 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await collection.doc(userId).set(cart);

    return cart;
  }
}
