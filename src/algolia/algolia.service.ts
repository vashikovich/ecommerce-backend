import { Injectable } from '@nestjs/common';
import algoliasearch from 'algoliasearch';

@Injectable()
export class AlgoliaService {
  private client;
  private index;

  constructor() {
    this.client = algoliasearch('your-algolia-app-id', 'your-algolia-admin-api-key');
    this.index = this.client.initIndex('products');
  }

  async addProduct(product) {
    return this.index.saveObject(product, { autoGenerateObjectIDIfNotExist: true });
  }

  async searchProducts(searchTerm: string) {
    const { hits } = await this.index.search(searchTerm);
    return hits;
  }
}
