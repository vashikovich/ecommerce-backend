import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { PaginatedProduct } from './dto/paginated-product.dto';
import { PaginationArgs } from 'src/common/pagination-args';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Query(() => PaginatedProduct)
  async searchProductsByTerm(
    @Args('searchTerm') searchTerm: string,
    @Args() pagination: PaginationArgs,
  ): Promise<PaginatedProduct> {
    return this.productService.searchProductsByTerm(searchTerm, pagination);
  }

  @Query(() => PaginatedProduct)
  async searchProductsByCategory(
    @Args('categoryId', { type: () => Int })
    categoryId: number,
    @Args() pagination: PaginationArgs,
  ): Promise<PaginatedProduct> {
    return this.productService.searchProductsByCategory(categoryId, pagination);
  }
}
