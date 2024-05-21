import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  private db;

  constructor(private firebaseAdminService: FirebaseAdminService) {
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
    const snapshot = await this.db.collection('orders').where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }
}