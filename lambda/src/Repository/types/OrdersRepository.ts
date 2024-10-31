/** Status do pedido */
type OrderStatus =
  /** Pedido recebido, aguardando confirmação de pagamento. */
  'received' |
  /** Pagamento aguardando confirmação. */
  'awaitingPayment' |
  /** Pagamento confirmado, pedido em processamento. */
  'paymentApproved' |
  /** Pedido em preparação para envio. */
  'inPreparation' |
  /** Produto personalizado em produção. */
  'inProduction' |
  /** Nota fiscal emitida. */
  'invoiced' |
  /** Pedido pronto para ser enviado pela transportadora. */
  'readyToShip' |
  /** Pedido enviado à transportadora. */
  'shipped' |
  /** Pedido em trânsito. */
  'inTransit' |
  /** Pedido entregue ao cliente. */
  'delivered' |
  /** Pedido cancelado. */
  'canceled' |
  /** Pedido devolvido pelo cliente. */
  'returned' |
  /** Há uma disputa sobre o pagamento ou entrega. */
  'inDispute' |
  /** Pedido disponível para retirada em ponto de coleta. */
  'awaitingPickup'

/** Items de um pedido */
interface OrderItem {
  /** ID do produto */
  productId: string
  /** Valor dos itens */
  totalAmount: number
  /** Total de produtos adquiridos */
  quantity: number
}

/** Pedido */
export interface OrderData {
  /** ID do pedido */
  orderId: string
  /** ID do usuário ao qual o pedido pertence */
  userId: string
  /** Data em que o pedido foi realizado */
  orderDate: Date
  /** Status do pedido */
  status: OrderStatus
  /** Itens que compõe o pedido */
  items: OrderItem[]
  /** Valor do pedido */
  totalAmount: number
}

export type SortType = 'ASC' | 'DESC'

export interface OrdersDB {
  listOrders: (params: { userId: string, sort: SortType }) => Promise<OrderData[]>
  getOrderById: (params: { userId: string, orderId: string }) => Promise<OrderData | undefined>
}

export interface OrdersRepository {
  listOrders: (params: { userId: string, sort: SortType }) => Promise<OrderData[]>
  getOrderById: (params: { userId: string, orderId: string }) => Promise<OrderData | undefined>
}
