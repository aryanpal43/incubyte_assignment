const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require('../controllers/sweet.controller');

// All routes require authentication
router.use(authMiddleware);

// Search sweets (must come before /:id route)
router.get('/search', searchSweets);

// Get all sweets
router.get('/', getAllSweets);

// Purchase and restock routes (must come before /:id route)
router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', adminMiddleware, restockSweet);

// Get sweet by ID
router.get('/:id', getSweetById);

// Create sweet (protected)
router.post('/', createSweet);

// Update sweet (protected)
router.put('/:id', updateSweet);

// Admin only routes
router.delete('/:id', adminMiddleware, deleteSweet);

module.exports = router;

