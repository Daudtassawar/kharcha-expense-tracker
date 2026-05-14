const express = require('express');
const db = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM recurring_expenses WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { description, amount, category, frequency, next_due } = req.body;
  const result = await db.query(
    'INSERT INTO recurring_expenses (user_id, description, amount, category, frequency, next_due) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [req.user.id, description, amount, category, frequency, next_due]
  );
  res.status(201).json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM recurring_expenses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

module.exports = router;
