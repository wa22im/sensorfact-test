import { schema } from './graphql';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import CreateLambdaApi from 'lambda-api';
import { getGraphQLParameters, processRequest } from 'graphql-helix';
import type { API, HandlerFunction } from 'lambda-api';
import type { GraphQLSchema } from 'graphql';

export function APIGatewayLambda(): API {
  const isTest = process.env.NODE_ENV === 'test';
  const isOffline = process.env.IS_OFFLINE === 'true';

  return CreateLambdaApi({
    version: 'v2',
    logger: isTest
      ? false
      : {
          level: isOffline ? 'debug' : 'info',
        },
  });
}

export const graphqlApi = <TContext = unknown>(
  schema: GraphQLSchema,
  contextFactory?: () => Promise<TContext> | TContext
): HandlerFunction => {
  return async function graphqlHandler(req, res): Promise<void> {
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    const { query, variables, operationName } = getGraphQLParameters(request);

    const result = await processRequest({
      schema,
      query,
      variables,
      operationName,
      request,
      contextFactory,
    });

    if (result.type === 'RESPONSE') {
      result.headers.forEach(({ name, value }) => {
        res.header(name, value);
      });
      res.status(result.status);
      res.json(result.payload);
    } else {
      req.log.error(`Unhandled: ${result.type}`);
      res.error(`Unhandled: ${result.type}`);
    }
  };
};

export function mkAPIGatewayHandler(api: API): APIGatewayProxyHandlerV2 {
  return async function apiGatewayHandler(event, ctx) {
    return api.run(event, ctx);
  };
}

const api = APIGatewayLambda();

api.any(graphqlApi(schema));

export const handler: APIGatewayProxyHandlerV2 = mkAPIGatewayHandler(api);
