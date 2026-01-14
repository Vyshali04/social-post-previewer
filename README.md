# QuickSocial – AI Social Post Previewer

A full-stack MERN application that helps users create, preview, and optimize social media posts using AI-powered tone adjustment.

## 🚀 Features

- **JWT Authentication** with bcrypt password hashing
- **Social Post Editor** with live character counter
- **Real-time Previews** for Twitter (X), LinkedIn, and Instagram
- **AI Tone Changer** (Professional, Funny, Hype) powered by Gemini API
- **Post Management** - Save, edit, delete drafts per user
- **Version Control** - Store original and AI-generated versions
- **Responsive UI** with light/dark mode toggle
- **Dashboard** with statistics and analytics

## 🛠 Tech Stack

### Frontend
- **React 18** with ES Modules
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with ES Modules
- **Express.js** framework
- **MongoDB Atlas** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Gemini AI** API
- **Helmet** and **Rate Limiting** for security

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Gemini API key

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd QuickSocial
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies at once
npm run install-all
```

### 3. Environment Setup

#### Backend (.env)
Create `backend/.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/quicksocial?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Gemini AI API
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
Create `frontend/.env.local` file:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Get API Keys

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `your_username` and `your_password` in the connection string

#### Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 5. Run the Application

#### Development Mode
```bash
# Start both frontend and backend
npm run dev
```

Or run separately:
```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)
cd frontend && npm start
```

#### Production Mode
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## 📁 Project Structure

```
QuickSocial/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Post.js          # Post model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── posts.js         # Post management routes
│   │   └── ai.js            # AI integration routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostEditor.jsx
│   │   │   └── SocialPreview.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PostEditor.jsx
│   │   │   ├── Drafts.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── package.json              # Root package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get user posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/stats` - Get user statistics

### AI
- `POST /api/ai/generate` - Generate AI content with tone
- `POST /api/ai/suggest` - Get AI suggestions for content

## 🎨 Features Overview

### Authentication System
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### Post Editor
- Real-time character counting
- Platform-specific character limits
- Tag system
- Draft and publish functionality

### AI Integration
- Tone transformation (Professional, Funny, Hype)
- Platform-specific optimization
- Content suggestions
- Real-time AI generation

### Social Media Previews
- Twitter (X) preview with engagement metrics
- LinkedIn professional preview
- Instagram-style preview with image placeholder
- Responsive design

### User Interface
- Dark/Light mode toggle
- Responsive design for all devices
- Modern, clean interface
- Smooth animations and transitions

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - Frontend URL for CORS

#### Frontend (.env.local)
- `VITE_API_URL` - Backend API URL

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting platform

### Backend (Heroku/Railway/Render)
1. Push your code to the hosting platform
2. Set all environment variables
3. Ensure MongoDB Atlas is accessible
4. Add your Gemini API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MONGODB_URI in .env
   - Ensure IP whitelist includes your deployment IP

2. **CORS Issues**
   - Verify FRONTEND_URL matches your frontend URL
   - Check that CORS is properly configured

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set and consistent
   - Check token expiration (7 days default)

4. **AI API Issues**
   - Verify GEMINI_API_KEY is valid
   - Check API quota and billing

5. **Build Issues**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear node_modules and reinstall if needed

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**
