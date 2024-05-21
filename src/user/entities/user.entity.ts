import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  uid: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  displayName?: string;
}
