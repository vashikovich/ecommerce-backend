import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Order } from './entities/order.entity';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  private db: FirebaseFirestore.Firestore;
  private collection: FirebaseFirestore.CollectionReference;

  constructor(
    private firebaseAdminService: FirebaseService,
    private cartService: CartService,
    private productService: ProductService,
    private emailService: EmailService,
    private userService: UserService,
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
      id: this.generateOrderId(),
      userId,
      date: new Date().toISOString(),
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
      status: 'Received',
      totalAmount: 0.0,
    };
    order.totalAmount = totalAmount;

    const orderRef = this.collection.doc(order.id);
    await orderRef.set(order);
    await this.cartService.resetCart(userId);

    const user = await this.userService.findById(userId);
    await this.emailService.sendEmail(user.email, 'ORDER', {
      order,
      name: user.displayName ?? user.email,
    });
    return order;
  }

  async getOrderById(id: string, userId: string): Promise<Order> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists)
      throw 'No order found for the specified ID or user not authorized';

    const order = { id: doc.id, ...doc.data() } as Order;

    if (order.userId !== userId)
      throw 'No order found for the specified ID or user not authorized';

    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const snapshot = await this.db
      .collection('orders')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
  }

  private generateOrderId() {
    const date = new Date();
    const seconds = Math.floor(date.valueOf() / 1000)
      .toString()
      .slice(-5);
    const dateStr = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
    return `INV${seconds}${dateStr}`;
  }
}
