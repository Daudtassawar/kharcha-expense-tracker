const express = require('express');
const db = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const uid = req.user.id;
  try {
    const expensesRes = await db.query('SELECT * FROM expenses WHERE user_id = $1', [uid]);
    const budgetRes = await db.query('SELECT * FROM budgets WHERE user_id = $1', [uid]);
    const goalsRes = await db.query('SELECT * FROM savings_goals WHERE user_id = $1', [uid]);
    const recurringRes = await db.query('SELECT * FROM recurring_expenses WHERE user_id = $1', [uid]);
    const userRes = await db.query('SELECT created_at FROM users WHERE id = $1', [uid]);

    const expenses = expensesRes.rows;
    const today = new Date().toISOString().split('T')[0];
    const monthPrefix = today.substring(0, 7);
    
    const todayTotal = expenses.filter(e => e.date === today).reduce((s, e) => s + parseFloat(e.amount), 0);
    const monthTotal = expenses.filter(e => e.date.startsWith(monthPrefix)).reduce((s, e) => s + parseFloat(e.amount), 0);
    
    const categoryTotals = {};
    expenses.filter(e => e.date.startsWith(monthPrefix)).forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount);
    });

    res.json({
      todayTotal,
      monthTotal,
      weekTotal: monthTotal / 4,
      yearTotal: monthTotal,
      categoryTotals,
      topCategory: { name: 'food', amount: 0 },
      dailySpending: [],
      monthlyTrend: [],
      budget: budgetRes.rows[0],
      savingsGoals: goalsRes.rows,
      recurringExpenses: recurringRes.rows,
      accountStats: { 
        totalExpensesCount: expenses.length, 
        totalSpentAllTime: expenses.reduce((s,e)=>s+parseFloat(e.amount),0), 
        memberSince: userRes.rows[0].created_at 
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
