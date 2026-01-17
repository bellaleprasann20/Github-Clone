# 🚀 GitHub Clone

A full-stack, fully functional GitHub clone built with the MERN stack (MongoDB, Express.js, React, Node.js). This project replicates core GitHub features with a modern, responsive UI that closely matches the real GitHub interface.

![GitHub Clone](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-18+-brightgreen)
![React](https://img.shields.io/badge/React-18+-61dafb)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 👤 User Management
- User profiles with customizable information
- Avatar support with Dicebear API
- Follow/Unfollow functionality
- View followers and following lists
- User search and discovery

### 📦 Repository Management
- Create public and private repositories
- Repository descriptions and topics
- Upload files during repository creation
- File explorer with tree view
- Code viewer with syntax highlighting
- Repository statistics (stars, forks, watchers)
- README.md support

### ⭐ Core GitHub Features
- Star/Unstar repositories
- Fork repositories
- Watch repositories
- Repository search
- Trending repositories
- Language detection and filtering

### 🎨 User Interface
- Fully responsive design (mobile, tablet, desktop)
- Dark theme matching GitHub's aesthetic
- Real-time notifications
- Intuitive navigation with sidebar and navbar
- Dropdown menus with click-outside detection
- Loading states and error handling

### 🔍 Additional Features
- File upload with drag & drop
- Code syntax highlighting
- Copy and download file contents
- Commit history tracking
- Branch management
- Rate limiting for API security

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9** - ODM for MongoDB
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure
```
github-clone/
│
├── frontend/                 # React frontend
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── assets/          # Images and static files
│   │   ├── components/      # React components
│   │   │   ├── common/      # Reusable components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── repo/        # Repository components
│   │   │   ├── auth/        # Authentication components
│   │   │   └── profile/     # Profile components
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Auth pages
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── repo/        # Repository pages
│   │   │   └── profile/     # Profile page
│   │   ├── services/        # API service layer
│   │   ├── context/         # React Context
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── routes/          # Route protection
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   ├── db.js       # MongoDB connection
│   │   │   └── cloud.js    # Cloud storage config
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Repository.js
│   │   │   ├── Commit.js
│   │   │   └── File.js
│   │   ├── controllers/    # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── repoController.js
│   │   │   ├── commitController.js
│   │   │   └── userController.js
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── repoRoutes.js
│   │   │   ├── commitRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── services/       # Business logic
│   │   │   ├── repoService.js
│   │   │   └── commitService.js
│   │   ├── utils/          # Utility functions
│   │   │   ├── generateToken.js
│   │   │   └── logger.js
│   │   ├── uploads/        # File uploads directory
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── logs/               # Application logs
│   ├── .env                # Environment variables
│   ├── package.json
│   └── nodemon.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6 or higher (local or MongoDB Atlas)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/github-clone.git
cd github-clone
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**

Create a `.env` file in the `backend` directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/github-clone
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/github-clone

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start Backend Server**
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

5. **Setup Frontend**

Open a new terminal:
```bash
cd frontend
npm install
```

6. **Configure Frontend Environment**

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

7. **Start Frontend Development Server**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 🗄️ Database Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### Option 2: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string
6. Update `MONGO_URI` in backend `.env`

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Repository Endpoints

#### Create Repository
```http
POST /api/repos
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "awesome-project",
  "description": "My awesome project",
  "isPrivate": false,
  "language": "JavaScript",
  "topics": ["react", "nodejs"],
  "files": []
}
```

#### Get User Repositories
```http
GET /api/repos/user/:username
```

#### Star Repository
```http
POST /api/repos/:id/star
Authorization: Bearer <token>
```

#### Fork Repository
```http
POST /api/repos/:id/fork
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:username
```

#### Follow User
```http
POST /api/users/:userId/follow
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Full-stack developer",
  "location": "San Francisco",
  "website": "https://example.com"
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **Input Sanitization** - NoSQL injection prevention
- **XSS Protection** - Cross-site scripting prevention

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark Theme** - GitHub-inspired dark mode
- **Smooth Animations** - CSS transitions
- **Loading States** - Better user feedback
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

## 🧪 Testing
```bash
# Backend tests (to be implemented)
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## 🌐 Deployment

### Deploy to Heroku (Backend)
```bash
cd backend
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

### Deploy to Vercel (Frontend)
```bash
cd frontend
vercel
```

### Deploy to Railway
```bash
# Both frontend and backend can be deployed to Railway
# Connect your GitHub repository and configure environment variables
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ES6+ syntax
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

## 🐛 Known Issues

- File upload limited to 10MB
- Real-time collaboration not yet implemented
- Mobile UI needs minor improvements
- Search functionality is basic

## 🗺️ Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] Pull requests functionality
- [ ] Issues and bug tracking
- [ ] Code review system
- [ ] GitHub Actions (CI/CD)
- [ ] Wiki pages
- [ ] Project boards
- [ ] Discussions
- [ ] GitHub Pages hosting
- [ ] Advanced search filters
- [ ] Two-factor authentication

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Design inspired by [GitHub](https://github.com)
- Icons from [Lucide](https://lucide.dev)
- Avatars from [DiceBear](https://dicebear.com)
- Documentation styled with Markdown

## 📸 Screenshots

### Home Dashboard
![Dashboard](screenshots/dashboard.png)

### Repository View
![Repository](screenshots/repository.png)

### Code Viewer
![Code Viewer](screenshots/code-viewer.png)

### User Profile
![Profile](screenshots/profile.png)

## 💡 Support

If you found this project helpful, please give it a ⭐️!

For support, email your.email@example.com or open an issue on GitHub.

---

Made with ❤️ and ☕ by [Your Name]
```

## 📄 Additional Files to Create

### **LICENSE** (Root directory)
```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### **.gitignore** (Root directory)
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db

# Uploads
backend/src/uploads/*
!backend/src/uploads/.gitkeep