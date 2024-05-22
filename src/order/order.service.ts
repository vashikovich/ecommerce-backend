import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrderService {
  private db: FirebaseFirestore.Firestore;

  constructor(private firebaseAdminService: FirebaseService) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async createOrder(order: CreateOrderInput): Promise<Order> {
    const orderRef = this.db.collection('orders').doc();
    const newOrder = {
      id: orderRef.id,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await orderRef.set(newOrder);
    return newOrder as Order;
  }

  async getOrderById(id: string): Promise<Order> {
    const doc = await this.db.collection('orders').doc(id).get();
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
