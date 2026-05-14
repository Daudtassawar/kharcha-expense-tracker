const express = require('express');
const db = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM savings_goals WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { title, target_amount, deadline } = req.body;
  const result = await db.query(
    'INSERT INTO savings_goals (user_id, title, target_amount, saved_amount, deadline) VALUES ($1, $2, $3, 0, $4) RETURNING *',
    [req.user.id, title, target_amount, deadline]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  await db.query(
    'UPDATE savings_goals SET saved_amount = $1 WHERE id = $2 AND user_id = $3',
    [req.body.saved_amount, req.params.id, req.user.id]
  );
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM savings_goals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

module.exports = router;
