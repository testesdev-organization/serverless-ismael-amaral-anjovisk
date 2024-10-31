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

  getOrderById = async (params: { orderId: string }): Promise<OrderData | undefined> => {
    return await this._orderDB.getOrderById({ orderId: params.orderId })
  }

  listOrders = async (params: { sort: SortType }): Promise<OrderData[]> => {
    return await this._orderDB.listOrders({ sort: params.sort })
  }
}
