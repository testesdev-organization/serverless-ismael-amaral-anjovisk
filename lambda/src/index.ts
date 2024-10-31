import { type APIGatewayProxyEvent, type Context, type APIGatewayProxyResult } from 'aws-lambda'
import OrdersRepositoryImpl from './Repository/OrdersRepositoryImpl'
import { OrdersS3 } from './DB/OrdersS3'
import { type SortType } from './Repository/types/OrdersRepository'

const STACK_REGION = process.env.STACK_REGION ?? 'sa-east-1'
const ORDERS_BUCKET = process.env.ORDERS_BUCKET ?? ''
const ORDERS_FILE_KEY = process.env.ORDERS_FILE_KEY ?? ''

const ordersRepository = new OrdersRepositoryImpl({
  dependencies: {
    orderDB: new OrdersS3({ awsRegion: STACK_REGION, bucket: ORDERS_BUCKET, fileKey: ORDERS_FILE_KEY })
  }
})

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

export const handleOrdersRestAPI = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = validateAndGetUserId(event)
    const sort = (event.queryStringParameters?.sort ?? 'DESC').toUpperCase() as SortType
    return {
      statusCode: 200,
      body: JSON.stringify(await ordersRepository.listOrders({ userId, sort }))
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return {
        statusCode: 401,
        body: ''
      }
    }
    return {
      statusCode: 500,
      body: error.message
    }
  }
}

export const handleOrderByIdRestAPI = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = validateAndGetUserId(event)
    const orderId = event.pathParameters?.orderId
    if (orderId === undefined || (orderId ?? '') === '') {
      return {
        statusCode: 400,
        body: ''
      }
    }
    const order = await ordersRepository.getOrderById({ userId, orderId })
    if (order === undefined) {
      return {
        statusCode: 404,
        body: ''
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ ...order })
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return {
        statusCode: 401,
        body: ''
      }
    }
    return {
      statusCode: 500,
      body: error.message
    }
  }
}

const validateAndGetUserId = (event: APIGatewayProxyEvent): string => {
  const userId = event.requestContext.authorizer?.claims?.sub
  if (userId === undefined || (userId ?? '') === '') {
    throw new Error('Unauthorized')
  }
  return userId
}
