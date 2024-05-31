import { Injectable } from '@nestjs/common';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { SearchedProductDto } from 'src/product/dto/searched-product.dto';

@Injectable()
export class AlgoliaService {
  private client: SearchClient;
  private index: SearchIndex;

  constructor() {
    this.client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY,
    );
    this.index = this.client.initIndex('e-commerce_products');
  }

  async searchProducts(searchTerm: string) {
    const { hits } = await this.index.search<SearchedProductDto>(searchTerm);
    return hits;
  }
}
