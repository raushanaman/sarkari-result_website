# Sarkari Result Website

A full-stack MERN application for government job notifications, results, and admit cards.

## Features

### User Features
- **3 Main Categories**: Results, Admit Cards, Upcoming Jobs
- **Detailed Job Pages**: Complete information with apply links
- **Responsive Design**: Works on all devices
- **Modern UI**: Clean and attractive interface

### Admin Features
- **Admin Dashboard**: Manage all job postings
- **CRUD Operations**: Create, Read, Update, Delete jobs
- **Category Management**: Organize jobs by type
- **Statistics**: View job counts by category

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for UI icons

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
# Copy .env file and update values
MONGODB_URI=mongodb://localhost:27017/sarkari-result
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Start MongoDB service (if using local MongoDB)

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Create Admin User

1. Use API endpoint to create admin:
```bash
POST http://localhost:5000/api/auth/create-admin
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Or use the demo credentials provided in the login page.

## Usage

### For Users
1. Visit the homepage
2. Browse categories: Results, Admit Cards, Upcoming Jobs
3. Click on any job to view detailed information
4. Use the "Apply Now" button to visit official application pages

### For Admins
1. Go to `/admin/login`
2. Login with admin credentials
3. Access the dashboard to:
   - View all jobs and statistics
   - Add new job postings
   - Edit existing jobs
   - Delete jobs

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/create-admin` - Create admin user

### Jobs
- `GET /api/jobs` - Get all jobs (with optional category filter)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)
- `GET /api/jobs/admin/all` - Get all jobs for admin

## Project Structure

```
sarkari-result-website/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # File uploads (if needed)
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Set environment variables in production

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Netlify, Vercel, or any static hosting service
3. Update API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact: info@sarkariresult.com