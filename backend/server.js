const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 5000;

const frontendRoute = path.join(__dirname, '../frontend', 'build');

// Configure session middleware
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "Leaderboard",
      ttl: 24 * 60 * 60, // 1-day session expiration
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

// Get allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
};

app.use(cors(corsOptions));
app.use(express.json());
// use static files 
app.use(express.static(frontendRoute));

app.use('/auth', authRoutes);
app.use('/api', leaderboardRoutes);

// serve static files from frontend/build
// '/{*splat}' -> replacement of '*' in express v5
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(frontendRoute, 'index.html'));
})

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URI}/Milestone`)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err));