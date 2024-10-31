import { type SortType, type OrderData, type OrdersDB } from '../Repository/types/OrdersRepository'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export class OrdersS3 implements OrdersDB {
  private _orders: OrderData[] | undefined
  private readonly _awsRegion: string
  private readonly _bucket: string
  private readonly _fileKey: string

  constructor (params: {
    awsRegion: string
    bucket: string
    fileKey: string
  }) {
    this._awsRegion = params.awsRegion
    this._bucket = params.bucket
    this._fileKey = params.fileKey
  }

  getOrderById = async (params: { userId: string, orderId: string }): Promise<OrderData | undefined> => {
    return (await this._getOrders({ userId: params.userId })).find(order => order.orderId.toUpperCase() === params.orderId.toUpperCase())
  }

  listOrders = async (params: { userId: string, sort: SortType }): Promise<OrderData[]> => {
    return (await this._getOrders({ userId: params.userId })).sort((a, b) => {
      const aDate = new Date(a.orderDate).getTime().toString()
      const bDate = new Date(b.orderDate).getTime().toString()
      return params.sort === 'ASC' ? aDate.localeCompare(bDate) : bDate.localeCompare(aDate)
    })
  }

  private readonly _getOrders = async (params: { userId: string }): Promise<OrderData[]> => {
    if (this._orders === undefined) {
      const client = new S3Client({ region: this._awsRegion })
      const command = new GetObjectCommand({
        Bucket: this._bucket,
        Key: this._fileKey
      })
      const getObjectCommandOutput = await client.send(command)
      const orders: OrderData[] = JSON.parse(await getObjectCommandOutput.Body?.transformToString() ?? '[]').map((item: OrderData) => ({
        ...item,
        orderDate: new Date(item.orderDate)
      }))
      this._orders = orders
    }
    return this._orders.filter(order => order.userId.toUpperCase() === params.userId.toUpperCase())
  }
}
