const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { csrfOriginGuard } = require('./middleware/csrfMiddleware');

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfOriginGuard);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DailyLife API is running' });
});

// --- Feature routes ---
// Each route module is added as its phase is implemented.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/summaries', require('./routes/summaryRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
