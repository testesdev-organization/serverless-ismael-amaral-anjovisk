import { type OrdersDB, type OrderData, type OrdersRepository, type SortType } from './types/OrdersRepository'

export default class OrdersRepositoryImpl implements OrdersRepository {
  private readonly _orderDB: OrdersDB
  constructor (params: {
    dependencies: {
      orderDB: OrdersDB
    }
  }) {
    this._orderDB = params.dependencies.orderDB
  }

  getOrderById = async (params: { userId: string, orderId: string }): Promise<OrderData | undefined> => {
    return await this._orderDB.getOrderById({ userId: params.userId, orderId: params.orderId })
  }

  listOrders = async (params: { userId: string, sort: SortType }): Promise<OrderData[]> => {
    return await this._orderDB.listOrders({ userId: params.userId, sort: params.sort })
  }
}
