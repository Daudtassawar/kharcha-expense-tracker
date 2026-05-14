const express = require('express');
const cors = require('cors');

// Import route modules
const { authRouter } = require('./auth');
const expensesRouter = require('./routes/expenses');
const statsRouter = require('./routes/stats');
const budgetRouter = require('./routes/budget');
const goalsRouter = require('./routes/goals');
const recurringRouter = require('./routes/recurring');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/recurring', recurringRouter);

// Root route welcome message
app.get('/', (req, res) => {
  res.send('<h1>✅ Kharcha Backend is Running</h1><p>Please open <b>frontend/index.html</b> in your browser to use the app.</p>');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Kharcha backend running → http://localhost:${PORT}`);
});
