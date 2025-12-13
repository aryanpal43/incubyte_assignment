const Sweet = require('../models/Sweet');

const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity: quantity || 0,
    });

    await sweet.save();

    res.status(201).json(sweet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error while creating sweet' });
  }
};

const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching sweets' });
  }
};

const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Server error while searching sweets' });
  }
};

const getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }
    res.status(500).json({ error: 'Server error while fetching sweet' });
  }
};

const updateSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;

    await sweet.save();

    res.json(sweet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }
    res.status(500).json({ error: 'Server error while updating sweet' });
  }
};

const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }
    res.status(500).json({ error: 'Server error while deleting sweet' });
  }
};

const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity === 0) {
      return res.status(400).json({ error: 'Sweet is out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json({
      message: 'Purchase successful',
      sweet,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }
    res.status(500).json({ error: 'Server error during purchase' });
  }
};

const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.quantity += parseInt(quantity);
    await sweet.save();

    res.json({
      message: 'Restock successful',
      sweet,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }
    res.status(500).json({ error: 'Server error during restock' });
  }
};

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};

