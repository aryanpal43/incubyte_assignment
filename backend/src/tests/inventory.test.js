const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const jwt = require('jsonwebtoken');

describe('Inventory Management API', () => {
  let userToken;
  let adminToken;
  let user;
  let admin;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://palaryan34541_db_user:fZ7j9OGLL5DZzjsr@cluster0.nbsg3he.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up first
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Wait a bit to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create regular user
    user = new User({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      role: 'USER',
    });
    await user.save();
    userToken = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');

    // Create admin user
    admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
    });
    await admin.save();
    adminToken = jwt.sign({ userId: admin._id.toString() }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweet;

    beforeEach(async () => {
      sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 10,
      });
    });

    it('should decrease quantity by 1 on purchase', async () => {
      const initialQuantity = sweet.quantity;

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.message).toBe('Purchase successful');
      expect(response.body.sweet.quantity).toBe(initialQuantity - 1);

      // Verify in database
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(initialQuantity - 1);
    });

    it('should allow multiple purchases', async () => {
      const initialQuantity = sweet.quantity;

      // First purchase
      await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Second purchase
      await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Verify in database
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(initialQuantity - 2);
    });

    it('should return 400 when quantity is 0', async () => {
      // Set quantity to 0
      sweet.quantity = 0;
      await sweet.save();

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.error).toBe('Sweet is out of stock');

      // Verify quantity remains 0
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(0);
    });

    it('should return 400 when trying to purchase with quantity 0', async () => {
      // Create a sweet with 0 quantity
      const outOfStockSweet = await Sweet.create({
        name: 'Out of Stock',
        category: 'Indian',
        price: 50,
        quantity: 0,
      });

      const response = await request(app)
        .post(`/api/sweets/${outOfStockSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.error).toBe('Sweet is out of stock');
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .expect(401);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweet;

    beforeEach(async () => {
      sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 10,
      });
    });

    it('should increase quantity on restock with admin authentication', async () => {
      const initialQuantity = sweet.quantity;
      const restockQuantity = 20;

      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: restockQuantity })
        .expect(200);

      expect(response.body.message).toBe('Restock successful');
      expect(response.body.sweet.quantity).toBe(initialQuantity + restockQuantity);

      // Verify in database
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(initialQuantity + restockQuantity);
    });

    it('should return 403 for regular user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 })
        .expect(403);

      expect(response.body.error).toContain('Admin privileges required');
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .send({ quantity: 20 })
        .expect(401);
    });

    it('should return 400 if quantity is missing', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toContain('Valid quantity is required');
    });

    it('should return 400 if quantity is 0 or negative', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);

      expect(response.body.error).toContain('Valid quantity is required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 20 })
        .expect(404);
    });

    it('should allow multiple restocks', async () => {
      const initialQuantity = sweet.quantity;

      // First restock
      await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 })
        .expect(200);

      // Second restock
      await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 15 })
        .expect(200);

      // Verify in database
      const updatedSweet = await Sweet.findById(sweet._id);
      expect(updatedSweet.quantity).toBe(initialQuantity + 10 + 15);
    });
  });
});

