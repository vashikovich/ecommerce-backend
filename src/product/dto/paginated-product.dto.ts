import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { PageInfo } from 'src/common/page-info';

@ObjectType()
export class ProductEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Product)
  node: Product;
}

@ObjectType()
export class PaginatedProduct {
  @Field(() => [ProductEdge], { nullable: true })
  edges: ProductEdge[];

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo;
}
