import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Error as STError } from 'supertokens-node';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    if (ctx['contextType'] === 'http') {
      // Handle HTTP context
      const resp = ctx.getResponse();
      let err = undefined;

      await verifySession(this.verifyOptions)(ctx.getRequest(), resp, (res) => {
        err = res;
      });

      if (resp.headersSent) {
        throw new STError({
          message: 'RESPONSE_SENT',
          type: 'RESPONSE_SENT',
        });
      }

      if (err) {
        throw err;
      }

      return true;
    } else if (ctx['contextType'] === 'graphql') {
      // Handle GraphQL context
      const gqlContext = GqlExecutionContext.create(context);
      const { req, res } = gqlContext.getContext();

      // ! RES IS UNDEFINED
      // ! console.log(res);

      // Using getSession() instead of verifySession() to avoid potential "Cannot set headers after they are sent to the client" errors,
      // as verifySession() can send responses directly in certain cases, conflicting with apollo-server's header modifications.
      const session = await Session.getSession(req, res, this.verifyOptions);
      req.session = session;
      return true;
    }

    // Handle other types of contexts if needed
    return false; // For other context types, guard is not applicable
  }
}
