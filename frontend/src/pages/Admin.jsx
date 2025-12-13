import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sweetsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockId, setRestockId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sweet = null) => {
    if (sweet) {
      setEditingSweet(sweet);
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString(),
      });
    } else {
      setEditingSweet(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSweet(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
      };

      if (editingSweet) {
        await sweetsAPI.update(editingSweet._id, sweetData);
        setSuccess('Sweet updated successfully!');
      } else {
        await sweetsAPI.create(sweetData);
        setSuccess('Sweet created successfully!');
      }

      handleCloseModal();
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await sweetsAPI.delete(id);
      setSuccess('Sweet deleted successfully!');
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleOpenRestockModal = (id) => {
    setRestockId(id);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  const handleCloseRestockModal = () => {
    setShowRestockModal(false);
    setRestockId(null);
    setRestockQuantity('');
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      await sweetsAPI.restock(restockId, parseInt(restockQuantity));
      setSuccess('Restock successful!');
      handleCloseRestockModal();
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Restock failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Admin Panel - Sweet Shop Management</h1>
          <div className="navbar-actions">
            <span>Welcome, {user?.name}</span>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Sweets</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add New Sweet
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <div className="grid">
            {sweets.map((sweet) => (
              <div key={sweet._id} className="sweet-card">
                <h3>{sweet.name}</h3>
                <div className="category">Category: {sweet.category}</div>
                <div className="price">₹{sweet.price}</div>
                <div className="quantity">Quantity: {sweet.quantity}</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenModal(sweet)}
                    style={{ flex: 1 }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleOpenRestockModal(sweet._id)}
                    style={{ flex: 1 }}
                  >
                    Restock
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(sweet._id)}
                    style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && sweets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            No sweets found. Add your first sweet!
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSweet ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRestockModal && (
        <div className="modal" onClick={handleCloseRestockModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Restock Sweet</h2>
            <form onSubmit={handleRestock}>
              <div className="form-group">
                <label>Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseRestockModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

