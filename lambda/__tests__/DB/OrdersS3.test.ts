const sendMock = jest.fn()
const getCommandOutputMock = jest.fn()
const transformToStringMock = jest.fn()

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
    const result = await ordersS3.listOrders({ sort: 'ASC' })
    expect(result).toEqual([])
  })

  it('should return orders - ASC', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate }
        ]))
      }
    }))
    const result = await ordersS3.listOrders({ sort: 'ASC' })
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
          { ...orderPriorDate }
        ]))
      }
    }))
    const result = await ordersS3.listOrders({ sort: 'DESC' })
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

  it('should return empty list', async () => {
    const ordersS3 = new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({}))
    const result = await ordersS3.listOrders({ sort: 'ASC' })
    expect(result).toEqual([])
  })

  it('should return order', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate }
        ]))
      }
    }))
    const result = await ordersS3.getOrderById({ orderId: orderLastDate.orderId })
    expect(result).toEqual({ ...orderLastDate, orderDate: new Date(orderLastDate.orderDate) })
  })

  it('should return undefiend', async () => {
    const ordersS3 =new OrdersS3({ awsRegion, bucket, fileKey })
    sendMock.mockImplementationOnce(() => Promise.resolve({
      Body: {
        transformToString: () => Promise.resolve(JSON.stringify([
          { ...orderLastDate },
          { ...orderPriorDate }
        ]))
      }
    }))
    const result = await ordersS3.getOrderById({ orderId: 'invalid-order-id' })
    expect(result).toEqual(undefined)
  })
})

const orderPriorDate = {
  "orderId": "d058b0c7-bcfe-436e-998e-722f712e2bdf",
  "userId": "cliente6",
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
  "userId": "cliente2",
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