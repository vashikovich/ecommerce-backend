import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImageUrl {
  @Field()
  thumbnail: string;

  @Field()
  small: string;

  @Field()
  original?: string;
}

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  brand?: string;

  @Field(() => Float)
  price: number;

  @Field()
  size: string;

  @Field(() => Int)
  stock?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ingredients?: string;

  @Field({ nullable: true })
  origin?: string;

  @Field(() => [ImageUrl])
  imageUrls: ImageUrl[];

  @Field(() => [Int])
  categoryIds: number[];
}
