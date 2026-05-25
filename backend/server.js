const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ✅ load env
dotenv.config();

// ✅ connect database
connectDB();

// ==========================
// 🚀 AUTO SEED ADMIN IMPORT
// ==========================
require('./seedAdmin'); // <-- THIS will run automatically once on server start

const app = express();

// ==========================
// 🌐 CORS CONFIG
// ==========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://lms-website-two-amber.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ==========================
// ⚙️ MIDDLEWARE
// ==========================
app.use(express.json());
app.use(morgan('dev'));

// ==========================
// 🧪 TEST ROUTE
// ==========================
app.get('/', (req, res) => {
  res.json({ message: 'MERN LMS API running' });
});

// ==========================
// 📦 ROUTES
// ==========================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

// ==========================
// ❌ ERROR HANDLERS
// ==========================
app.use(notFound);
app.use(errorHandler);

// ==========================
// 🚀 START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
