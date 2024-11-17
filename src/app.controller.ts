import { Controller, Get, UseGuards } from '@nestjs/common';
// ...
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session/session.decorator';
import { User } from './user.entity';
// ...

@Controller()
export class AppController {
  @Get('/getuser')
  @UseGuards(new AuthGuard())
  getSessionInfo(@Session() session: SessionContainer) {
    return new User(
      session.getHandle(),
      session.getUserId(),
      session.getAccessTokenPayload(),
    );
  }
}
