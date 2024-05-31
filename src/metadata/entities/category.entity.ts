import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Subcategory } from './subcategory.entity';

@ObjectType()
export class Category {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [Subcategory])
  subcategories: Subcategory[];
}
