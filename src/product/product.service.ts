import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private db: FirebaseFirestore.Firestore;

  constructor(private firebaseAdminService: FirebaseAdminService) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async getProductById(id: string): Promise<Product> {
    const doc = await this.db.collection('products').doc(id).get();
    return { id: doc.id, ...doc.data() } as Product;
  }
}
