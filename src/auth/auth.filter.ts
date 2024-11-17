import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { errorHandler } from 'supertokens-node/framework/express';
import { Error as STError } from 'supertokens-node';
import SuperTokens from 'supertokens-node';
import { GraphQLError } from 'graphql';
import Session from 'supertokens-node/recipe/session';

@Catch(STError)
export class SupertokensExceptionFilter implements ExceptionFilter {
  handler: ErrorRequestHandler; //| GraphQLError;

  constructor() {
    this.handler = errorHandler();
  }

  catch(exception: Error, host: ArgumentsHost) {
    if (host['contextType'] === 'http') {
      const ctx = host.switchToHttp();

      const resp = ctx.getResponse<Response>();
      if (resp.headersSent) {
        return;
      }

      this.handler(
        exception,
        ctx.getRequest<Request>(),
        resp,
        ctx.getNext<NextFunction>(),
      );
    } else if (host['contextType'] === 'graphql') {
      if (Session.Error.isErrorFromSuperTokens(exception)) {
        throw new GraphQLError(exception.message, {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: {
              status:
                exception.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
            },
          },
        });
      }

      if (SuperTokens.Error.isErrorFromSuperTokens(exception)) {
        throw new GraphQLError(exception.message, {
          extensions: {
            code: exception.type,
            http: { status: 500 },
          },
        });
      }
    }
  }
}
