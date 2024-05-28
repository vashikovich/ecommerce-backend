import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Product } from './entities/product.entity';
import { AlgoliaService } from 'src/algolia/algolia.service';

@Injectable()
export class ProductService {
  private db: FirebaseFirestore.Firestore;

  constructor(
    private firebaseAdminService: FirebaseService,
    private algoliaService: AlgoliaService,
  ) {
    this.db = this.firebaseAdminService.getFirestore();
  }

  async getProductById(id: string): Promise<Product> {
    const doc = await this.db.collection('products').doc(id).get();
    return { id: doc.id, ...doc.data() } as Product;
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const searchResultsDto =
      await this.algoliaService.searchProducts(searchTerm);
    const searchResult: Product[] = searchResultsDto.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      size: p.size,
      imageUrls: [
        {
          thumbnail: p.imageThumbnail,
          small: p.imageGallery,
        },
      ],
      categoryIds: p.categoryIds,
    }));
    return searchResult;
  }
}
