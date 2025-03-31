require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport');        

const app = express();

// Correct CORS configuration
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');

const PORT = process.env.PORT || 5000;

// Debug middleware: logs every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Enable MongoDB Debugging
mongoose.set('debug', true);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);

// Test route
app.get('/', (req, res) => {
  console.log('GET / triggered');
  res.json({ message: 'Server is running!' });
});

const path = require('path');

// Serve static files from Vite's build output
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Serve index.html for any unmatched routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
