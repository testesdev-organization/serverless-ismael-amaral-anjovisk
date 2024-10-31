import { OrderData, OrdersDB } from "../../src/Repository/types/OrdersRepository"
import OrdersRepositoryImpl from "../../src/Repository/OrdersRepositoryImpl"

const getOrderByIdMock = jest.fn()
const listOrdersMock = jest.fn()

const ordersDBMock: OrdersDB = {
  getOrderById: jest.fn().mockImplementation(getOrderByIdMock),
  listOrders: jest.fn().mockImplementation(listOrdersMock)
}

const ordersRepository = new OrdersRepositoryImpl({ 
  dependencies: {
    orderDB: ordersDBMock
  }
})

describe('listOrders', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    listOrdersMock.mockRestore()
    jest.clearAllMocks()
  })

  it('should list orders', async () => {
    listOrdersMock.mockImplementationOnce(() => Promise.resolve([
      { ...orderPriorDate },
      { ...orderLastDate }

    ]))
    const result = await ordersRepository.listOrders({ userId, sort: 'ASC' })
    expect(result).toEqual([
      { ...orderPriorDate },
      { ...orderLastDate }

    ])
  })
})

describe('getOrderById', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    getOrderByIdMock.mockRestore()
    jest.clearAllMocks()
  })

  it('should return order', async () => {
    getOrderByIdMock.mockImplementationOnce(() => Promise.resolve({ ...orderPriorDate }))
    const result = await ordersRepository.getOrderById({ userId, orderId: orderPriorDate.orderId })
    expect(result).toEqual({ ...orderPriorDate })
  })
})

const userId = 'fb7c5d6c-1363-4e7a-b3c0-cf35d57f6ac5'

const orderPriorDate: OrderData = {
  "orderId": "d058b0c7-bcfe-436e-998e-722f712e2bdf",
  "userId": "cliente6",
  "orderDate": new Date("2024-04-30T08:06:52.885Z"),
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
const orderLastDate: OrderData = {
  "orderId": "72ab33eb-42a7-4e8c-8f15-d1fe232c79fd",
  "userId": "cliente2",
  "orderDate": new Date("2024-09-14T16:41:02.779Z"),
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