import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { AlgoliaModule } from 'src/algolia/algolia.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [ProductResolver, ProductService],
  imports: [FirebaseModule, AlgoliaModule],
})
export class ProductModule {}
