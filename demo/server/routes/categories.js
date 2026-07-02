const express = require('express');
const pool = require('../config/db');
const router = express.Router();

function response(res, code, message, data = null) {
  res.json({ code, message, data });
}

// 获取分类列表
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT category_id, parent_id, name, icon, sort_order FROM categories WHERE status = 1 ORDER BY sort_order, category_id'
    );
    response(res, 200, 'success', rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
