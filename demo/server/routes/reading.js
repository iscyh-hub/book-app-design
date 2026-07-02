const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

function response(res, code, message, data = null) {
  res.json({ code, message, data });
}

// 保存阅读进度（同时更新书架记录）
router.post('/progress', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { book_id, chapter_id, position = 0, progress = 0 } = req.body;
    if (!book_id || !chapter_id) {
      return response(res, 400, 'book_id 和 chapter_id 必填');
    }

    await pool.execute(
      `INSERT INTO bookshelf (user_id, book_id, last_chapter_id, last_read_position, progress)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         last_chapter_id = VALUES(last_chapter_id),
         last_read_position = VALUES(last_read_position),
         progress = VALUES(progress),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, book_id, chapter_id, position, progress]
    );

    response(res, 200, '阅读进度已保存');
  } catch (err) {
    next(err);
  }
});

// 记录阅读时长
router.post('/records', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { book_id, chapter_id, duration = 0 } = req.body;
    if (!book_id) {
      return response(res, 400, 'book_id 必填');
    }

    const readDate = new Date().toISOString().slice(0, 10);
    await pool.execute(
      'INSERT INTO reading_records (user_id, book_id, chapter_id, duration, read_date) VALUES (?, ?, ?, ?, ?)',
      [userId, book_id, chapter_id || null, duration, readDate]
    );

    response(res, 200, '阅读记录已保存');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
