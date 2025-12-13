import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sweetsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchName) params.name = searchName;
      if (searchCategory) params.category = searchCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await sweetsAPI.search(params);
      setSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to search sweets');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    try {
      await sweetsAPI.purchase(id);
      setSuccess('Purchase successful!');
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleClearFilters = () => {
    setSearchName('');
    setSearchCategory('');
    setMinPrice('');
    setMaxPrice('');
    fetchSweets();
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Sweet Shop Management System</h1>
          <div className="navbar-actions">
            <span>Welcome, {user?.name}</span>
            {user?.role === 'ADMIN' && (
              <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                Admin Panel
              </button>
            )}
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <h2>Search & Filter</h2>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear
            </button>
          </div>
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
                <div className={`quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
                  {sweet.quantity === 0 ? 'Out of Stock' : `Quantity: ${sweet.quantity}`}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handlePurchase(sweet._id)}
                  disabled={sweet.quantity === 0}
                  style={{ width: '100%' }}
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && sweets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            No sweets found. {user?.role === 'ADMIN' && 'Add some sweets from the Admin Panel!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

