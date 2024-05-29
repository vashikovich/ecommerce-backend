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

  private async createCartIfNotExist(userId: string): Promise<Cart> {
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
    const cart = (doc.data() as Cart) ?? {
      userId,
      items: [],
    };
    return cart;
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

    const product = await this.productService.getProductById(productId);

    const item = cart.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity++;
      if (item.quantity > product.stock) {
        throw new BadRequestException('Product stock is not sufficient');
      }
    } else {
      cart.items.push({ productId, quantity: 1 });
      if (product.stock < 1) {
        throw new BadRequestException('Product stock is not sufficient');
      }
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

    const product = await this.productService.getProductById(productId);

    const cart = doc.data() as Cart;
    const item = cart.items.find((i) => i.productId === productId);
    item.quantity = quantity;
    if (item.quantity > product.stock) {
      throw new BadRequestException('Product stock is not sufficient');
    }

    await collection.doc(userId).set(cart);

    return cart;
  }
}
