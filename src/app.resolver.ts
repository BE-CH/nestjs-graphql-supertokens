import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';
import { Session } from './auth/session/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Resolver(() => User)
export class AppResolver {
  constructor() {}

  @UseGuards(new AuthGuard())
  @Query(() => User)
  async getUser(@Session() session: SessionContainer) {
    return new User(
      session.getHandle(),
      session.getUserId(),
      JSON.stringify(session.getAccessTokenPayload()),
    );
  }
}
