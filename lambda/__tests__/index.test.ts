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
    jest.clearAllMocks()
  })

  it('should return 200', async () => {
    await expect(handleOrdersRestAPI({} as any, {} as any)).rejects.toThrow('Not implemented')
  })
})

describe('handleOrderByIdRestAPI', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200', async () => {
    await expect(handleOrderByIdRestAPI({} as any, {} as any)).rejects.toThrow('Not implemented')
  })
})