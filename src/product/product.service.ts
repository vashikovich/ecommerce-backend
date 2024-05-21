import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private db;

  constructor(private firebaseAdminService: FirebaseAdminService) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async getAllProducts(): Promise<Product[]> {
    const snapshot = await this.db.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  async getProductById(id: string): Promise<Product> {
    const doc = await this.db.collection('products').doc(id).get();
    return { id: doc.id, ...doc.data() } as Product;
  }

  async createProduct(product: Product): Promise<Product> {
    const docRef = await this.db.collection('products').add({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...product };
  }
}
