const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

function response(res, code, message, data = null) {
  res.json({ code, message, data });
}

// 获取我的书架
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await pool.execute(
      `SELECT bs.id, bs.book_id, bs.progress, bs.last_chapter_id, bs.last_read_position, bs.is_favorite, bs.updated_at,
              b.title, b.author, b.cover
       FROM bookshelf bs
       JOIN books b ON bs.book_id = b.book_id
       WHERE bs.user_id = ?
       ORDER BY bs.updated_at DESC`,
      [userId]
    );
    response(res, 200, 'success', rows);
  } catch (err) {
    next(err);
  }
});

// 加入书架
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { book_id, is_favorite = 1 } = req.body;
    if (!book_id) {
      return response(res, 400, 'book_id 必填');
    }

    await pool.execute(
      `INSERT INTO bookshelf (user_id, book_id, is_favorite) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE is_favorite = VALUES(is_favorite), updated_at = CURRENT_TIMESTAMP`,
      [userId, book_id, is_favorite]
    );
    response(res, 200, '加入书架成功');
  } catch (err) {
    next(err);
  }
});

// 移出书架
router.delete('/:book_id', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const bookId = req.params.book_id;
    await pool.execute('DELETE FROM bookshelf WHERE user_id = ? AND book_id = ?', [userId, bookId]);
    response(res, 200, '移出书架成功');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
