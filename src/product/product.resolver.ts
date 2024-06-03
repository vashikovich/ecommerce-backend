import { Resolver, Query, Args } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => Product)
  async product(@Args('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Query(() => [Product])
  async searchProducts(
    @Args('searchTerm', { nullable: true }) searchTerm?: string,
    @Args('categoryId', { nullable: true }) categoryId?: number,
  ) {
    if (searchTerm) {
      return this.productService.searchProductsByTerm(searchTerm);
    } else {
      return this.productService.searchProductsByCategory(categoryId);
    }
  }
}
