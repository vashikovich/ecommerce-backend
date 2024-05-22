import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImageUrls {
  @Field()
  thumbnail: string;

  @Field()
  small: string;

  @Field()
  original: string;
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

  @Field()
  ingredients: string;

  @Field()
  origin: string;

  @Field(() => [ImageUrls])
  imageUrls: ImageUrls[];
}
