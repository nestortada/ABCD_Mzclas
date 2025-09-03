# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new

## 🔐 Authentication API

The `/server` directory contains an Express backend that exposes authentication endpoints with JWT and MongoDB.

### Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file inside `server` and define:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mern_auth
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   JWT_RESET_SECRET=your_reset_secret
   JWT_RESET_EXPIRES_IN=15m
   FRONTEND_URL=http://localhost:5173
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=username
   SMTP_PASS=password
   FROM_EMAIL=noreply@example.com
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Example requests
Base URL: `http://localhost:5000/auth`

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123","name":"User"}'

# Login and store cookie
curl -i -c cookies.txt -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'

# Current user
curl -b cookies.txt http://localhost:5000/auth/me

# Logout
curl -b cookies.txt -X POST http://localhost:5000/auth/logout

# Forgot password
curl -X POST http://localhost:5000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset password
curl -X POST http://localhost:5000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token>","newPassword":"NewPass123"}'
```

### Manual tests
- Register, login, ensure cookie grants access to `/auth/me`.
- `/auth/forgot-password` always returns 200.
- `/auth/reset-password` rejects invalid or expired tokens; after reset, previous login tokens are invalid.
