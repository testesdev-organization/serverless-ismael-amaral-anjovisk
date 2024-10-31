const listOrdersMock = jest.fn()
const getOrderByIdMock = jest.fn()

jest.mock('../src/Repository/OrdersRepositoryImpl', () => {
  return jest.fn().mockImplementation(() => ({
    listOrders: jest.fn().mockImplementation(listOrdersMock),
    getOrderById: jest.fn().mockImplementation(getOrderByIdMock)
  }))
})

import { handleOrderByIdRestAPI, handleOrdersRestAPI, handleRestAPI } from '../src/index'

describe('handleRestAPI', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200', async () => {
    const result = await handleRestAPI({} as any, {} as any)
    expect(result).toEqual({
      body: JSON.stringify({
        id: '3f708f2e-bb07-4e05-8d3a-683639ea0674',
        description: 'O que tira o seu foco, não merece sua atenção.'
      }),
      statusCode: 200
    })
  })
})

describe('handleOrdersRestAPI', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    listOrdersMock.mockReset()
    jest.clearAllMocks()
  })

  it('should return 200', async () => {
    listOrdersMock.mockImplementationOnce(() => Promise.resolve([{ ...order1 }]))
    const result = await handleOrdersRestAPI({
      requestContext: {
        authorizer: {
          claims: {
            sub: userId
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify([{ ...order1 }])
    })
  })

  it('should return 401', async () => {
    listOrdersMock.mockImplementationOnce(() => Promise.resolve([{ ...order1 }]))
    const result = await handleOrdersRestAPI({
      requestContext: {
        authorizer: {
          claims: {
            sub: undefined
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 401,
      body: ''
    })
  })

  it('should return 500', async () => {
    const errorMessage = 'Erro qualquer'
    listOrdersMock.mockImplementationOnce(() => { throw new Error(errorMessage) })
    const result = await handleOrdersRestAPI({
      requestContext: {
        authorizer: {
          claims: {
            sub: userId
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 500,
      body: errorMessage
    })
  })
})

describe('handleOrderByIdRestAPI', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    getOrderByIdMock.mockRestore()
    jest.clearAllMocks()
  })

  it('should return 401', async () => {
    const result = await handleOrderByIdRestAPI({
      pathParameters: {
        orderId: 'invalid-id'
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: undefined
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 401,
      body: ''
    })
  })

  it('should return 404', async () => {
    const result = await handleOrderByIdRestAPI({
      pathParameters: {
        orderId: 'invalid-id'
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: userId
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 404,
      body: ''
    })
  })

  it('should return 400', async () => {
    const result = await handleOrderByIdRestAPI({
      pathParameters: {
        orderId: undefined
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: userId
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 400,
      body: ''
    })
  })

  it('should return 200', async () => {
    getOrderByIdMock.mockImplementationOnce(() => Promise.resolve({ ...order1 }))
    const result = await handleOrderByIdRestAPI({
      pathParameters: {
        orderId: order1.orderId
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: userId
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ ...order1 })
    })
  })

  it('should return 500', async () => {
    const errorMessage = 'Erro qualquer'
    getOrderByIdMock.mockImplementationOnce(() => { throw new Error(errorMessage) })
    const result = await handleOrderByIdRestAPI({
      pathParameters: {
        orderId: order1.orderId
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: userId
          }
        }
      }
    } as any, {} as any)
    expect(result).toEqual({
      statusCode: 500,
      body: errorMessage
    })
  })
})

const userId = 'sljdfalkjdflakd-lfaklds'

const order1 = {
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
