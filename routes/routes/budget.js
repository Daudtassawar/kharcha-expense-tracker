const express = require('express');
const db = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM budgets WHERE user_id = $1', [req.user.id]);
  res.json(result.rows[0]);
});

router.put('/', async (req, res) => {
  const { monthly_limit, daily_limit } = req.body;
  await db.query(
    'UPDATE budgets SET monthly_limit = $1, daily_limit = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
    [monthly_limit, daily_limit, req.user.id]
  );
  res.json({ success: true });
});

module.exports = router;
