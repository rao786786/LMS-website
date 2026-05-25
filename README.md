# MERN Stack Learning Management System

A polished full-stack MERN project with:
- React frontend
- Node.js + Express backend
- MongoDB + Mongoose database
- JWT authentication
- bcrypt password hashing
- Role-based access for admin, instructor, and student
- Lesson links with clickable and embedded lecture previews
- A modern UI with cards, gradients, and animations

## Folder Structure

```
mern_lms_final_project/
├── backend/
└── frontend/
```

## How to run

### 1) Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed:admin
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Environment variables

### backend/.env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lms_db
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@lms.com
ADMIN_PASSWORD=Admin@12345
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
```

## Demo admin credentials

- Email: `admin@lms.com`
- Password: `Admin@12345`

## API Routes

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Courses
- GET `/api/courses`
- GET `/api/courses/:id`
- POST `/api/courses`
- PUT `/api/courses/:id`
- DELETE `/api/courses/:id`
- PUT `/api/courses/:id/lessons`

### Users
- GET `/api/users`
- DELETE `/api/users/:id`
- GET `/api/users/analytics/summary`

### Enrollments
- POST `/api/enrollments`
- GET `/api/enrollments/my-courses`

