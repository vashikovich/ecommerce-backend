import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Module({
  providers: [ProductResolver, ProductService, FirebaseAdminService],
})
export class ProductModule {}
