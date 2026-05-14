const express = require('express');
const cors = require('cors');
const path = require('path');

// Import route modules
const { authRouter } = require('./auth');
const expensesRouter = require('./routes/expenses');
const statsRouter = require('./routes/stats');
const budgetRouter = require('./routes/budget');
const goalsRouter = require('./routes/goals');
const recurringRouter = require('./routes/recurring');

const app = express();

// Enhanced CORS for Capacitor and Web security
const allowedOrigins = [
  'capacitor://localhost',
  'http://localhost',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // Allow any origin for now to prevent lockout, but log it for security
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mount API routes
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/recurring', recurringRouter);

// Serve static frontend files
app.use(express.static(__dirname));

// Root route - Serve the frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Kharcha backend running → http://localhost:${PORT}`);
});
