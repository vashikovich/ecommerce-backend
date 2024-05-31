import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Category } from './entities/category.entity';

@Injectable()
export class MetadataService {
  private db: FirebaseFirestore.Firestore;

  constructor(private firebaseAdminService: FirebaseService) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async getCategories() {
    const ref = await this.db.collection('categories').get();
    const cats = ref.docs.map((d) => d.data() as Category);
    return cats;
  }
}
