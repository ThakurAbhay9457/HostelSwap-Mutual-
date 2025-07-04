var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const swapRoutes = require('./routes/swap');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/swap', swapRoutes);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
