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
  async searchProducts(@Args('searchTerm') searchTerm: string) {
    return this.productService.searchProducts(searchTerm);
  }
}
