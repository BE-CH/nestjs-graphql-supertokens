import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Session = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context['contextType'] === 'http') {
      // For HTTP context
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      return request.session;
    }

    if (context['contextType'] === 'graphql') {
      // For GraphQL context
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext();
      return req.session;
    }

    throw new Error('Unsupported context type');
  },
);
