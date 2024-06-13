import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ImageUrl, Product } from './entities/product.entity';
import { cursorUtils } from 'src/common/utils';
import { PaginatedProduct } from './dto/paginated-product.dto';
import { AlgoliaService } from 'src/algolia/algolia.service';
import {
  ProductSortType,
  SearchProductsInput,
} from './dto/search-params.input';
import { SearchedProductDto } from './dto/searched-product.dto';
import { AlgoliaIndex } from 'src/algolia/constants/algolia.index';
import { PaginationArgs } from 'src/common/dto/pagination.args';

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
  }

  async searchProducts(
    {
      searchTerm = '',
      sortBy = ProductSortType.Relevance,
      filterBy = { local: false, peak: false },
      brandFilter = [],
      categoryFilter = [],
    }: SearchProductsInput,
    { first = 10, after }: PaginationArgs,
  ): Promise<PaginatedProduct> {
    const cursor = after ? cursorUtils.decode<{ offset: number }>(after) : null;
    const offset = cursor?.offset ? cursor.offset + 1 : 0;

    let indexName: AlgoliaIndex;
    switch (sortBy) {
      case ProductSortType.PriceAsc: {
        indexName = 'e-commerce_products_price_asc';
        break;
      }
      case ProductSortType.PriceDesc: {
        indexName = 'e-commerce_products_price_desc';
        break;
      }
      case ProductSortType.Relevance:
      default: {
        indexName = 'e-commerce_products';
        break;
      }
    }

    const filters = [
      filterBy?.local ? 'local:true' : null,
      filterBy?.peak ? 'peak:true' : null,
      brandFilter?.filter((b) => b.trim()).length
        ? `(${brandFilter
            .filter((b) => b.trim())
            .map((b) => `brand:"${b}"`)
            .join(' OR ')})`
        : null,
      categoryFilter?.filter((c) => c).length
        ? `(${categoryFilter
            .filter((c) => c)
            .map((c) => `categoryIds:${c}`)
            .join(' OR ')})`
        : null,
    ]
      .filter((f) => f !== null)
      .join(' AND ');

    const index = this.algoliaService.getIndex(indexName);
    const results = await index.search<SearchedProductDto>(searchTerm, {
      filters,
      facets: ['brand', 'categoryIds'],
      offset,
      length: first,
    });

    const paginatedResult: PaginatedProduct = {
      edges: results.hits.map((p) => ({
        node: {
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          size: p.size,
          local: p.local,
          peak: p.peak,
          imageUrls: [
            {
              thumbnail: p.imageThumbnail,
              small: p.imageGallery,
            },
          ],
          categoryIds: p.categoryIds,
        },
        cursor: cursorUtils.encode({
          offset: offset + results.hits.indexOf(p),
        }),
      })),
      pageInfo: {
        total: results.nbHits,
        availableBrands: results.facets['brand']
          ? Object.keys(results.facets['brand']).map((k) => ({
              brand: k,
              count: results.facets['brand'][k],
            }))
          : [],
        availableCategories: results.facets['categoryIds']
          ? Object.keys(results.facets['categoryIds']).map((k) => ({
              categoryId: Number(k),
              count: results.facets['categoryIds'][k],
            }))
          : [],
      },
    };
    return paginatedResult;
  }
}
