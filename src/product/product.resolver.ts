import { Resolver, Query, Args } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { PaginatedProduct } from './dto/paginated-product.dto';
import { SearchProductsInput } from './dto/search-params.input';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Query(() => PaginatedProduct)
  async searchProducts(
    @Args('input') input: SearchProductsInput,
    @Args() pagination: PaginationArgs,
  ): Promise<PaginatedProduct> {
    return this.productService.searchProducts(input, pagination);
  }
}
