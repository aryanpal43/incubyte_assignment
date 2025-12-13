const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const jwt = require('jsonwebtoken');

describe('Sweets API', () => {
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

  describe('POST /api/sweets', () => {
    it('should create a new sweet with authentication', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
    });

    it('should return 401 without authentication token', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      };

      await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if price is negative', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: -10,
        quantity: 100,
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 100 },
        { name: 'Rasgulla', category: 'Indian', price: 40, quantity: 80 },
        { name: 'Chocolate Cake', category: 'Western', price: 200, quantity: 20 },
      ]);
    });

    it('should get all sweets with authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .get('/api/sweets')
        .expect(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 100 },
        { name: 'Rasgulla', category: 'Indian', price: 40, quantity: 80 },
        { name: 'Chocolate Cake', category: 'Western', price: 200, quantity: 20 },
        { name: 'Gajar Halwa', category: 'Indian', price: 60, quantity: 50 },
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Gulab')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Gulab Jamun');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Indian')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.length).toBe(3);
      response.body.forEach(sweet => {
        expect(sweet.category).toBe('Indian');
      });
    });

    it('should filter sweets by minPrice', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=50')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      response.body.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(50);
      });
    });

    it('should filter sweets by maxPrice', async () => {
      const response = await request(app)
        .get('/api/sweets/search?maxPrice=50')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      response.body.forEach(sweet => {
        expect(sweet.price).toBeLessThanOrEqual(50);
      });
    });

    it('should filter sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=40&maxPrice=60')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      response.body.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(40);
        expect(sweet.price).toBeLessThanOrEqual(60);
      });
    });

    it('should combine multiple search filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Indian&minPrice=50')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      response.body.forEach(sweet => {
        expect(sweet.category).toBe('Indian');
        expect(sweet.price).toBeGreaterThanOrEqual(50);
      });
    });
  });

  describe('GET /api/sweets/:id', () => {
    let sweet;

    beforeEach(async () => {
      sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
    });

    it('should get sweet by ID with authentication', async () => {
      const response = await request(app)
        .get(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body._id.toString()).toBe(sweet._id.toString());
      expect(response.body.name).toBe('Gulab Jamun');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .get(`/api/sweets/${sweet._id}`)
        .expect(401);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweet;

    beforeEach(async () => {
      sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
    });

    it('should update sweet with authentication', async () => {
      const updateData = {
        name: 'Updated Gulab Jamun',
        price: 60,
      };

      const response = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.category).toBe(sweet.category); // Should remain unchanged
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' })
        .expect(404);
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .send({ name: 'Updated' })
        .expect(401);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweet;

    beforeEach(async () => {
      sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
    });

    it('should delete sweet with admin authentication', async () => {
      await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedSweet = await Sweet.findById(sweet._id);
      expect(deletedSweet).toBeNull();
    });

    it('should return 403 for regular user', async () => {
      await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .expect(401);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});

