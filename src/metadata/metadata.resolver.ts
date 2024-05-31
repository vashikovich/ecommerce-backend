import { Resolver, Query, ResolveField } from '@nestjs/graphql';
import { Metadata } from './dto/metadata.dto';
import { MetadataService } from './metadata.service';
import { Category } from './entities/category.entity';

@Resolver(() => Metadata)
export class MetadataResolver {
  constructor(private metadataService: MetadataService) {}

  @Query(() => Metadata)
  async metadata() {
    return new Metadata();
  }

  @ResolveField(() => [Category])
  async categories() {
    const cats = await this.metadataService.getCategories();
    return cats;
  }
}
