import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ImageUrl, Product } from './entities/product.entity';
import { PaginationArgs } from 'src/common/pagination-args';
import { cursorUtils } from 'src/common/utils';
import { PaginatedProduct } from './dto/paginated-product.dto';
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

  async searchProductsByTerm(
    searchTerm: string,
    pagination: PaginationArgs,
  ): Promise<PaginatedProduct> {
    const cursor = pagination?.after
      ? cursorUtils.decode<{ offset: number }>(pagination.after)
      : null;
    const searchResultsDto = await this.algoliaService.searchProducts({
      searchTerm,
      offset: cursor?.offset ? cursor.offset + 1 : 0,
      length: pagination?.first || 20,
    });
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
    const paginatedResult: PaginatedProduct = {
      edges: searchResult.map((p) => ({
        node: p,
        cursor: cursorUtils.encode({ offset: searchResult.indexOf(p) }),
      })),
    };
    return paginatedResult;
  }

  async searchProductsByCategory(
    categoryId: number,
    pagination: PaginationArgs,
  ): Promise<PaginatedProduct> {
    const cursor = pagination?.after
      ? cursorUtils.decode<{ id: string }>(pagination.after)
      : null;

    let query = this.db
      .collection('products')
      .where('categoryIds', 'array-contains', categoryId);

    if (cursor?.id) {
      query = query.where('id', '>', cursor?.id);
    }

    const queryResult = await query.limit(pagination?.first || 20).get();
    const searchResult: Product[] = queryResult.docs.map((doc) => {
      const data = doc.data();
      const imageUrls = [] as ImageUrl[];
      for (let i = 0; i < data.imagesGallery.length; i++) {
        imageUrls.push({
          small: data.imagesGallery[i],
          thumbnail: data.imagesThumbnail[i],
          original: data.imagesOriginal[i],
        });
      }
      return { id: doc.id, ...data, imageUrls } as Product;
    });
    const paginatedResult: PaginatedProduct = {
      edges: searchResult.map((p) => ({
        node: p,
        cursor: cursorUtils.encode({ id: p.id }),
      })),
    };
    return paginatedResult;
  }
}
