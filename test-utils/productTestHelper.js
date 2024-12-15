const fs = require('fs/promises');
const { create, destroy } = require('../products');

const productTestHelper = {
  testProductIds: [],

  async setupTestData() {
    console.log('Loading test products...');
    const data = await fs.readFile('data/full-products.json', 'utf-8');
    const testProducts = JSON.parse(data);

    for (const product of testProducts) {
      if (!product.price) {
        product.price = Math.floor(Math.random() * 100) + 1;
      }
      const createdProduct = await create(product);
      this.testProductIds.push(createdProduct.id);
    }
    console.log('Test products loaded successfully');
  },
    // Optional helper if needed for orders:
  async createTestOrders(count = 5) {
    const { create: createOrder } = require('../orders');
    for (let i = 0; i < count; i++) {
      await createOrder({
        buyerEmail: `testbuyer${i}@example.com`,
        items: [
          {
            productId: this.testProductIds[0],
            quantity: 1
          }
        ]
      });
    }
  }
  };

  async cleanupTestData() {
    console.log('Cleaning up test products...');
    for (const productId of this.testProductIds) {
      await destroy(productId);
    }
    console.log('Test products cleaned up successfully');
  },
};

module.exports = productTestHelper;
