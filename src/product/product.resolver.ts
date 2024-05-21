import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  async products() {
    return this.productService.getAllProducts();
  }

  @Query(() => Product)
  async product(@Args('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Mutation(() => Product)
  async createProduct(@Args('product') product: Product) {
    return this.productService.createProduct(product);
  }
}
