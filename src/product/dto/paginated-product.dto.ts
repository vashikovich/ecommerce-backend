import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/paginated';
import { Product } from '../entities/product.entity';

@ObjectType()
export class PaginatedProduct extends Paginated(Product) {}
