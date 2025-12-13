# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://palaryan34541_db_user:fZ7j9OGLL5DZzjsr@cluster0.nbsg3he.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

4. Run tests:
```bash
npm test
```

5. Start server:
```bash
npm run dev
```

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Testing the Application

1. Start backend server (port 5000)
2. Start frontend server (port 3000)
3. Open browser to http://localhost:3000
4. Register a new user (or login)
5. Test features:
   - Browse sweets
   - Search and filter
   - Purchase sweets
   - If admin: Manage inventory

## Default Test Users

You can register users with different roles:
- Regular User: Register with role "USER"
- Admin User: Register with role "ADMIN"

## API Testing

You can test the API using:
- Postman
- curl
- The frontend interface

Example API call:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

