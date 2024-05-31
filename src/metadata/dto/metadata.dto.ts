import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@ObjectType()
export class Metadata {
  @Field(() => [Category])
  categories?: Category[];
}
