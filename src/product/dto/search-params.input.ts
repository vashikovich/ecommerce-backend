import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

export enum ProductSortType {
  Relevance,
  PriceAsc,
  PriceDesc,
}

registerEnumType(ProductSortType, { name: 'ProductSortType' });

@InputType()
class ProductFilterInput {
  @Field({ nullable: true })
  peak?: boolean;

  @Field({ nullable: true })
  local?: boolean;
}

@InputType()
export class SearchProductsInput {
  @Field({ nullable: true })
  searchTerm?: string;

  @Field(() => ProductSortType, { nullable: true })
  sortBy?: ProductSortType;

  @Field({ nullable: true })
  filterBy?: ProductFilterInput;

  @Field(() => [String], { nullable: true })
  brandFilter?: string[];

  @Field(() => [Int], { nullable: true })
  categoryFilter?: number[];
}
