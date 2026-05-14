const express = require('express');
const db = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { category, from, to } = req.query;
  let query = 'SELECT * FROM expenses WHERE user_id = $1';
  const params = [req.user.id];
  
  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (from) {
    params.push(from);
    query += ` AND date >= $${params.length}`;
  }
  if (to) {
    params.push(to);
    query += ` AND date <= $${params.length}`;
  }
  
  query += ' ORDER BY date DESC, id DESC';
  
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { description, amount, category, date, note } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO expenses (user_id, description, amount, category, date, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, description, amount, category, date, note || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/export/csv', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    const list = result.rows;
    let csv = 'Description,Amount,Category,Date\n';
    list.forEach(e => csv += `"${e.description}",${e.amount},"${e.category}","${e.date}"\n`);
    res.header('Content-Type', 'text/csv').attachment('expenses.csv').send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
