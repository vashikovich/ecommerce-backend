import { Injectable } from '@nestjs/common';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { AlgoliaIndex } from './constants/algolia.index';

@Injectable()
export class AlgoliaService {
  private client: SearchClient;

  constructor() {
    this.client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY,
    );
  }

  getIndex(index: AlgoliaIndex) {
    return this.client.initIndex(index);
  }
}
