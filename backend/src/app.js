const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const sweetRoutes = require('./routes/sweet.routes');

const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://incubyte-assignment-hpkx.onrender.com',
    'https://incubyte-assignment-sigma.vercel.app',
    /\.onrender\.com$/, // Allow all Render.com subdomains
    /\.vercel\.app$/, // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sweet Shop API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;

