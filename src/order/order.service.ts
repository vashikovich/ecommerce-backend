import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Order } from './entities/order.entity';
import { CartService } from 'src/cart/cart.service';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  private db: FirebaseFirestore.Firestore;
  private collection: FirebaseFirestore.CollectionReference;

  constructor(
    private firebaseAdminService: FirebaseService,
    private cartService: CartService,
    private productService: ProductService,
  ) {
    this.db = this.firebaseAdminService.getFirestore();
    this.collection = this.db.collection('orders');
  }

  async createOrder(userId: string): Promise<Order> {
    const cart = await this.cartService.getCartByUserId(userId);
    const products = await Promise.all(
      cart.items.map((i) => this.productService.getProductById(i.productId)),
    );

    let totalAmount = 0.0;
    const order: Order = {
      id: uuidv4(),
      userId,
      items: cart.items.map((i) => {
        const prod = products.find((p) => p.id === i.productId);
        totalAmount += i.quantity * prod.price;
        return {
          productId: prod.id,
          name: prod.name,
          brand: prod.brand,
          size: prod.size,
          imageUrl: prod.imageUrls[0]?.small,
          unitPrice: prod.price,
          quantity: i.quantity,
        };
      }),
      status: 'DONE',
      totalAmount: 0.0,
    };
    order.totalAmount = totalAmount;

    const orderRef = this.collection.doc(order.id);
    await orderRef.set(order);
    return order;
  }

  async getOrderById(id: string): Promise<Order> {
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() } as Order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const snapshot = await this.db
      .collection('orders')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
  }
}
