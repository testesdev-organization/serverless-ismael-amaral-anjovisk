const sendMock = jest.fn()
const getCommandOutputMock = jest.fn()

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockImplementation(sendMock)
    })),
    GetObjectCommand: jest.fn()
  }
})

import { OrdersS3 } from "../../src/DB/OrdersS3"
const awsRegion = 'sa-east-1'
const bucket = 'bucket-teste'
const fileKey = 'orders.json'

describe('listOrders', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    sendMock.mockRestore()
    getCommandOutputMock.mockRestore()
    jest.clearAllMocks()
  })

  it('should return empty list', async () => {
    const ordersS3 = new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({}))
    const result = await ordersS3.listOrders({ userId, sort: 'ASC' })
    expect(result).toEqual([])
  })

  it('should return orders - ASC', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate },
          { ...orderAnotherUser }
        ]))
      }
    }))
    const result = await ordersS3.listOrders({ userId, sort: 'ASC' })
    expect(result).toEqual([
      { ...orderPriorDate },
      { ...orderLastDate }
    ].map(item => ({ ...item, orderDate: new Date(item.orderDate) })))
  })

  it('should return orders - DESC', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate },
          { ...orderAnotherUser }
        ]))
      }
    }))
    const result = await ordersS3.listOrders({ userId, sort: 'DESC' })
    expect(result).toEqual([
      { ...orderLastDate },
      { ...orderPriorDate }
    ].map(item => ({ ...item, orderDate: new Date(item.orderDate) })))
  })
})

describe('getOrderById', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    sendMock.mockRestore()
    getCommandOutputMock.mockRestore()
    jest.clearAllMocks()
  })

  it('should return order', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate },
          { ...orderAnotherUser }
        ]))
      }
    }))
    const result = await ordersS3.getOrderById({ userId, orderId: orderLastDate.orderId })
    expect(result).toEqual({ ...orderLastDate, orderDate: new Date(orderLastDate.orderDate) })
  })

  it('should return undefiend - invalid order id', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate },
          { ...orderAnotherUser }
        ]))
      }
    }))
    const result = await ordersS3.getOrderById({ userId, orderId: 'invalid-order-id' })
    expect(result).toEqual(undefined)
  })

  it('should return undefiend - order belongs to another user', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate },
          { ...orderAnotherUser }
        ]))
      }
    }))
    const result = await ordersS3.getOrderById({ userId: orderAnotherUser.userId, orderId: orderLastDate.orderId })
    expect(result).toEqual(undefined)
  })
})

const userId = 'fb7c5d6c-1363-4e7a-b3c0-cf35d57f6ac5'
const anotherUserId = 'cliente1'

const orderPriorDate = {
  "orderId": "d058b0c7-bcfe-436e-998e-722f712e2bdf",
  "userId": userId,
  "orderDate": "2024-04-30T08:06:52.885Z",
  "status": "readyToShip",
  "items": [
    {
      "productId": "78441256-a44c-4567-98ab-4b6d49c621e6",
      "quantity": 2,
      "totalAmount": 3600
    },
    {
      "productId": "a840dc95-9b49-476e-b844-90cdfc38fd48",
      "quantity": 4,
      "totalAmount": 942
    },
    {
      "productId": "98b4g619-33bc-4579-a855-08a9e2d33469",
      "quantity": 2,
      "totalAmount": 2999.98
    }
  ],
  "totalAmount": 7541.98
}
const orderLastDate = {
  "orderId": "72ab33eb-42a7-4e8c-8f15-d1fe232c79fd",
  "userId": userId,
  "orderDate": "2024-09-14T16:41:02.779Z",
  "status": "readyToShip",
  "items": [
    {
      "productId": "98b4g619-33bc-4579-a855-08a9e2d33469",
      "quantity": 3,
      "totalAmount": 4499.97
    },
    {
      "productId": "ad97f35f-a44c-4569-a84b-08a9e2d33469",
      "quantity": 5,
      "totalAmount": 125
    },
    {
      "productId": "a840dc95-9b49-476e-b844-90cdfc38fd48",
      "quantity": 1,
      "totalAmount": 235.5
    }
  ],
  "totalAmount": 4860.47
}
const orderAnotherUser = {
  "orderId": "3c86010b-63c1-4be1-9a2d-eb0ecd30addf",
  "userId": anotherUserId,
  "orderDate": "2024-09-14T05:07:53.453Z",
  "status": "paymentApproved",
  "items": [
    {
      "productId": "78441256-a44c-4567-98ab-4b6d49c621e6",
      "quantity": 5,
      "totalAmount": 9000
    }
  ],
  "totalAmount": 9000
}