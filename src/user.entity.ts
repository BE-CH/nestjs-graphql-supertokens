import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { description: 'Session Handle' })
  sessionHandle: string;

  @Field(() => String, { description: 'User ID' })
  userId: string;

  @Field(() => String, { description: 'Access token payload' })
  accessTokenPayload: string;

  // Constructor to initialize properties
  constructor(
    sessionHandle: string,
    userId: string,
    accessTokenPayload: string,
  ) {
    this.sessionHandle = sessionHandle;
    this.userId = userId;
    this.accessTokenPayload = accessTokenPayload;
  }
}
