const fs = require('fs');
const uuid = require('uuid')

const products = require('../../data/products.json')

// Dados dos clientes
const customers = [
  { id: 'cliente1', name: 'João Silva' },
  { id: 'cliente2', name: 'Maria Santos' },
  { id: 'cliente3', name: 'Elaine Moreira' },
  { id: 'cliente4', name: 'Erica Martins' },
  { id: 'cliente5', name: 'Cleiton Alvarenga' },
  { id: 'cliente6', name: 'Anderson Rodrigues' },
  { id: 'candidato-user-id', name: 'Candidato' }
];

const initialDate = new Date('2024-01-01')
const finalDate = new Date('2024-10-10')

function generateDate() {
  // Convertemos as datas para timestamps (milissegundos desde 1/1/1970)
  const timestampInicial = initialDate.getTime();
  const timestampFinal = finalDate.getTime();

  // Geramos um número aleatório entre 0 e 1 e o multiplicamos pela diferença entre os timestamps
  const timestampAleatorio = timestampInicial + Math.random() * (timestampFinal - timestampInicial);

  // Criamos uma nova data a partir do timestamp aleatório
  const dataAleatoria = new Date(timestampAleatorio);

  return dataAleatoria;
}

// Função para gerar um pedido aleatório
function generateOrder() {
  const randomCustomerId = customers[Math.floor(Math.random() * customers.length)].id;
  const randomItemsQuantity = Math.floor(Math.random() * 3) + 1;

  const order = {
    orderId: generateRandomId(),
    userId: randomCustomerId,
    orderDate: generateDate().toISOString(),
    status: getRandomStatus(),
    items: []
  };

  for (let index = 0; index < randomItemsQuantity; index++) {
    const randomQuantity = Math.floor(Math.random() * 5) + 1;
    let randomProductId = '';
    do {
      randomProductId = products[Math.floor(Math.random() * products.length)].productId;
    } while (order.items.some(item => item.productId === randomProductId))
    order.items.push({
      productId: randomProductId,
      quantity: randomQuantity,
      totalAmount: products.find(p => p.productId === randomProductId).price * randomQuantity
    })
  }

  return { ...order, totalAmount: calculateTotal(order.items) };
}

// Funções auxiliares
function generateRandomId() {
  return uuid.v4()
}

function getRandomStatus() {
  const statuses = [ 'received', 'awaitingPayment', 'paymentApproved',
    'inPreparation', 'inProduction', 'invoiced', 'readyToShip', 'shipped',
    'inTransit', 'delivered', 'canceled', 'returned', 'inDispute','awaitingPickup'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function calculateTotal(items) {
  return items.reduce((total, item) => total + item.totalAmount, 0);
}

// Gerar 3 pedidos aleatórios
const orders = [];
for (let i = 0; i < 200; i++) {
  orders.push(generateOrder());
}

fs.writeFile('orders.json', JSON.stringify(orders, null, 2), (err) => {
  if (err) throw err;
  process.exit();
})