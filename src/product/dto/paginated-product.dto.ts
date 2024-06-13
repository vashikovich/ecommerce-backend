import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';

@ObjectType()
export class ProductEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Product)
  node: Product;
}

@ObjectType()
class BrandFacet {
  @Field()
  brand: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
class CategoryFacet {
  @Field(() => Int)
  categoryId: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
class PageInfo {
  @Field(() => Int)
  total: number;

  @Field(() => [BrandFacet])
  availableBrands: BrandFacet[];

  @Field(() => [CategoryFacet])
  availableCategories: CategoryFacet[];
}

@ObjectType()
export class PaginatedProduct {
  @Field(() => [ProductEdge])
  edges: ProductEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
