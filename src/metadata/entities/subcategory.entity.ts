import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Subcategory {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  image: string;
}
