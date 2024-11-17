# NestJS + GraphQL + Supertokens

This example repo shows how to use NestJS with GraphQL routes together with Supertokens.

The GraphQL is setup using NestJS guide and the ApolloDriver. Read more here: https://docs.nestjs.com/graphql/quick-start

The most important part of this, is the `auth.guard.ts`, `session.decorator.ts` and the `auth.filter.ts`.

They work by looking at the context of the request. If the context is `graphql` then it does one thing, and if the context is `http` then it does another thing!

Take a look at the code!
