# Sweet Shop Management System

A comprehensive full-stack application for managing a sweet shop inventory with user authentication, role-based access control, and real-time inventory management.

## 📋 Project Overview

This is a complete **Sweet Shop Management System** built using **Test-Driven Development (TDD)** methodology. The system allows users to browse and purchase sweets, while administrators can manage the inventory, add new products, update existing ones, and restock items.

### Key Features

- **User Authentication**: JWT-based authentication with role-based access (USER, ADMIN)
- **Sweet Management**: Full CRUD operations for sweets
- **Advanced Search**: Filter sweets by name, category, and price range
- **Inventory Management**: Purchase and restock functionality with real-time quantity updates
- **Admin Panel**: Dedicated interface for administrators to manage the shop
- **Responsive UI**: Clean and modern user interface built with React

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Jest + Supertest** - Testing framework

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management for authentication

### Database
- **MongoDB Atlas** - Cloud database

## ✨ Features

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Role-based access control (USER, ADMIN)
- Password hashing with bcrypt
- Protected routes with middleware

### Sweet Management
- Create, read, update, and delete sweets
- Search sweets by name (case-insensitive)
- Filter by category
- Filter by price range (min/max)
- Combined search filters

### Inventory Management
- Purchase sweets (decreases quantity)
- Restock sweets (increases quantity) - Admin only
- Out-of-stock validation
- Real-time quantity updates

### User Interface
- Clean and responsive design
- Dashboard for browsing sweets
- Admin panel for inventory management
- Search and filter UI
- Purchase button (disabled when out of stock)
- Success/error notifications

## 🚀 Backend Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://palaryan34541_db_user:fZ7j9OGLL5DZzjsr@cluster0.nbsg3he.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Running Tests

Run all tests with coverage:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🎨 Frontend Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🔐 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 🧪 Running Tests & Test Report

### Backend Tests

The backend includes comprehensive test suites:

1. **Authentication Tests** (`auth.test.js`):
   - User registration (success and failure cases)
   - User login (success and failure cases)
   - Password hashing validation
   - Email validation
   - Duplicate email handling

2. **Sweets Tests** (`sweets.test.js`):
   - Create sweet (with authentication)
   - Get all sweets
   - Get sweet by ID
   - Update sweet
   - Delete sweet (admin only)
   - Search and filter functionality
   - Protected route access

3. **Inventory Tests** (`inventory.test.js`):
   - Purchase sweet (decrease quantity)
   - Restock sweet (admin only, increase quantity)
   - Out-of-stock validation
   - Multiple purchases/restocks
   - Authorization checks

### Running Tests

```bash
cd backend
npm test
```

### Test Coverage

The test suite aims for high coverage with meaningful assertions. Run tests with coverage:

```bash
npm test
```

Expected coverage:
- Authentication: ~95%
- Sweet Management: ~90%
- Inventory Management: ~95%

## 📁 Project Structure

```
sweet-shop-management/
│
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── server.js              # Server entry point
│   │   ├── config/
│   │   │   └── db.js              # Database connection
│   │   ├── models/
│   │   │   ├── User.js            # User model
│   │   │   └── Sweet.js           # Sweet model
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Authentication routes
│   │   │   └── sweet.routes.js    # Sweet management routes
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Auth business logic
│   │   │   └── sweet.controller.js # Sweet business logic
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  # JWT authentication
│   │   │   └── admin.middleware.js # Admin authorization
│   │   └── tests/
│   │       ├── auth.test.js       # Auth test suite
│   │       ├── sweets.test.js     # Sweet test suite
│   │       └── inventory.test.js  # Inventory test suite
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   └── Admin.jsx         # Admin panel
│   │   ├── components/           # Reusable components
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decrease quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increase quantity)

## 📸 Screenshots

_Note: Screenshots will be added after deployment or local testing._

- Login Page
- Registration Page
- User Dashboard
- Admin Panel
- Search & Filter Interface

## 🚢 Deployment Steps (Optional)

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update MongoDB URI if needed
3. Deploy using Git or CLI
4. Ensure the PORT is set correctly

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Set environment variable `VITE_API_URL` to your backend URL
3. Deploy the `dist` folder

## 🧠 My AI Usage

### AI Tools Used
- **Cursor AI** - Primary development assistant
- **ChatGPT** - Code review and architecture guidance

### How AI Was Used

#### 1. **Project Scaffolding**
AI was used to generate the initial project structure, including:
- Directory structure following best practices
- Package.json configurations
- Basic Express and React setup files

#### 2. **Test-Driven Development**
AI assisted in:
- Writing comprehensive test cases before implementation
- Identifying edge cases and failure scenarios
- Structuring test suites for maximum coverage

**Example:**
```javascript
// AI-generated test structure for authentication
it('should return 400 if email already exists', async () => {
  // Test implementation
});
```

#### 3. **Code Implementation**
AI helped with:
- Implementing controllers following SOLID principles
- Creating middleware for authentication and authorization
- Building React components with proper state management
- Setting up API service layer with interceptors

#### 4. **Error Handling**
AI suggested:
- Comprehensive error handling patterns
- User-friendly error messages
- Proper HTTP status codes

#### 5. **Documentation**
AI assisted in:
- Generating comprehensive README
- Documenting API endpoints
- Creating setup instructions

### Reflection on AI Impact

#### Positive Impacts:
1. **Speed**: Significantly accelerated development by generating boilerplate code and test structures
2. **Best Practices**: AI suggested modern patterns and best practices (e.g., Context API, Axios interceptors)
3. **Test Coverage**: AI helped identify edge cases that might have been missed
4. **Code Quality**: Consistent code style and structure across the project

#### Challenges:
1. **Context Management**: Required careful review to ensure AI-generated code matched project requirements
2. **Integration**: Some AI suggestions needed manual refinement for proper integration
3. **Testing**: Had to verify all AI-generated tests actually work with the implementation

#### Learning Outcomes:
1. **TDD Discipline**: Using AI for test generation reinforced TDD principles
2. **Code Review**: Enhanced ability to review and refine AI-generated code
3. **Architecture**: Better understanding of clean architecture through AI suggestions
#### future overview {MUST CLICK THE PICTURE IT HAS VIDEO CLICK PICTURE ⬇️⬇️👇👇👇👇}
[![Watch the video](future.png)](https://drive.google.com/file/d/14sIWy_KYUP-XJxJECaULrQeRlTAhLHF-/view?usp=drive_link)


### AI-Assisted Commit Messages

Following the transparency requirement, commit messages would include:

```
feat: add sweets API with tests

Used AI to scaffold initial test cases and route structure.
Manually refined validation, business logic, and error handling.

Co-authored-by: ChatGPT <AI@users.noreply.github.com>
```

```
feat: implement inventory management with TDD

AI-generated test cases for purchase and restock functionality.
Manually implemented business logic and edge case handling.

Co-authored-by: Cursor AI <AI@users.noreply.github.com>
```

## 🎯 TDD Approach

This project strictly follows Test-Driven Development:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimal code to pass tests
3. **REFACTOR**: Clean up and optimize code

All features were developed using this cycle, ensuring:
- High test coverage
- Reliable code
- Better design decisions

## 📝 License

This project is open source and available for educational purposes.

## 👥 Author

Developed using TDD methodology with AI assistance for scaffolding and code generation.

---

**Note**: This project was built as a demonstration of TDD practices and full-stack development skills. All code is production-ready and follows industry best practices.

