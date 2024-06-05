// src/auth/user.entity.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  passwordHash?: string;

  refreshTokenHash?: string;

  @Field({ nullable: true })
  displayName?: string;
}
