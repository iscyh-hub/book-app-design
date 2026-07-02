const express = require('express');
const pool = require('../config/db');
const router = express.Router();

function response(res, code, message, data = null) {
  res.json({ code, message, data });
}

// 图书列表
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 20, 1), 50);
    const categoryId = req.query.category_id;
    const keyword = req.query.keyword ? req.query.keyword.trim() : '';
    const sort = req.query.sort || 'newest';

    let where = 'WHERE status = 1';
    const params = [];

    if (categoryId) {
      where += ' AND category_id = ?';
      params.push(categoryId);
    }

    if (keyword) {
      where += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'hottest') orderBy = 'ORDER BY created_at DESC';
    if (sort === 'best_selling') orderBy = 'ORDER BY price ASC';

    const offset = (page - 1) * size;
    const countSql = `SELECT COUNT(*) AS total FROM books ${where}`;
    const [countRows] = await pool.execute(countSql, params);
    const total = countRows[0].total;

    const listSql = `SELECT book_id, title, author, cover, category_id, price, original_price, is_ebook, is_audiobook, summary, word_count FROM books ${where} ${orderBy} LIMIT ${size} OFFSET ${offset}`;
    const [rows] = await pool.execute(listSql, params);

    response(res, 200, 'success', {
      total,
      page,
      size,
      list: rows,
    });
  } catch (err) {
    next(err);
  }
});

// 图书详情 + 章节目录
router.get('/:id', async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const [bookRows] = await pool.execute(
      'SELECT * FROM books WHERE book_id = ? AND status = 1',
      [bookId]
    );
    if (bookRows.length === 0) {
      return response(res, 404, '图书不存在');
    }

    const [chapterRows] = await pool.execute(
      'SELECT chapter_id, chapter_no, title, is_free FROM chapters WHERE book_id = ? ORDER BY chapter_no',
      [bookId]
    );

    const book = bookRows[0];
    book.chapters = chapterRows;
    response(res, 200, 'success', book);
  } catch (err) {
    next(err);
  }
});

// 章节内容
router.get('/:id/chapters/:cid', async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const chapterId = req.params.cid;

    const [rows] = await pool.execute(
      `SELECT c.chapter_id, c.chapter_no, c.title, c.content, c.audio_url, c.is_free,
              p.chapter_id AS prev_chapter_id, n.chapter_id AS next_chapter_id
       FROM chapters c
       LEFT JOIN chapters p ON p.book_id = c.book_id AND p.chapter_no = c.chapter_no - 1
       LEFT JOIN chapters n ON n.book_id = c.book_id AND n.chapter_no = c.chapter_no + 1
       WHERE c.book_id = ? AND c.chapter_id = ?`,
      [bookId, chapterId]
    );

    if (rows.length === 0) {
      return response(res, 404, '章节不存在');
    }

    response(res, 200, 'success', rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
