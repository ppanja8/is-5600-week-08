const { mockDb, mockProducts, mockModel } = require('./db.mock');
const { list, get, destroy, edit } = require('../products');

// Mock the db module to use our mockDb
jest.mock('../db', () => mockDb);

describe('Product Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should list products', async () => {
      const products = await list();
      expect(products.length).toBe(2);
      expect(products[0].description).toBe('Product 1');
      expect(products[1].description).toBe('Product 2');
    });
  });

  describe('get', () => {
    it('should get a product by id', async () => {
      mockModel.findById = jest.fn().mockResolvedValue({ description: 'Product 1' });
      const product = await get('mockId');
      expect(mockModel.findById).toHaveBeenCalledWith('mockId');
      expect(product.description).toBe('Product 1');
    });
  });

  describe('destroy', () => {
    it('should delete a product by id', async () => {
      mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      const result = await destroy('mockId');
      expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'mockId' });
      expect(result.deletedCount).toBe(1);
    });
  });

  describe('edit', () => {
    it('should edit a product', async () => {
        const changes = { description: 'Updated Product 1' };
        const mockProduct = { 
            description: 'Product 1', 
            save: jest.fn().mockResolvedValue({ description: 'Updated Product 1' }) 
        };
        mockModel.findById = jest.fn().mockResolvedValue(mockProduct);
        const updatedProduct = await edit('123', changes);
        expect(updatedProduct).toBeDefined();
        expect(updatedProduct.description).toBe('Updated Product 1');
        expect(mockProduct.save).toHaveBeenCalled();
    });
});
});
