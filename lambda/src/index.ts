import { type APIGatewayProxyEvent, type Context, type APIGatewayProxyResult } from 'aws-lambda'

export const handleRestAPI = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: '3f708f2e-bb07-4e05-8d3a-683639ea0674',
      description: 'O que tira o seu foco, não merece sua atenção.'
    })
  }
}
