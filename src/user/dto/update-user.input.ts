import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  displayName?: string;

  refreshTokenHash?: string;
}
