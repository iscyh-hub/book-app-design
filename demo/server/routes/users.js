const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// 统一响应
function response(res, code, message, data = null) {
  res.json({ code, message, data });
}

// 注册
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, nickname } = req.body;
    if (!username || !password) {
      return response(res, 400, '用户名和密码必填');
    }

    const [existing] = await pool.execute('SELECT user_id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return response(res, 400, '用户名已存在');
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
      [username, hashed, nickname || username]
    );

    response(res, 200, '注册成功', { user_id: result.insertId, username, nickname: nickname || username });
  } catch (err) {
    next(err);
  }
});

// 登录
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return response(res, 400, '用户名和密码必填');
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND status = 1', [username]);
    if (rows.length === 0) {
      return response(res, 401, '用户名或密码错误');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response(res, 401, '用户名或密码错误');
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    response(res, 200, '登录成功', {
      user_id: user.user_id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      is_vip: user.is_vip,
      token,
    });
  } catch (err) {
    next(err);
  }
});

// 获取用户信息
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, username, nickname, avatar, email, phone, is_vip, vip_expire_date FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    if (rows.length === 0) {
      return response(res, 404, '用户不存在');
    }
    response(res, 200, 'success', rows[0]);
  } catch (err) {
    next(err);
  }
});

// 更新用户信息
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { nickname, avatar, email, phone } = req.body;
    await pool.execute(
      'UPDATE users SET nickname = ?, avatar = ?, email = ?, phone = ? WHERE user_id = ?',
      [nickname || null, avatar || null, email || null, phone || null, req.user.user_id]
    );
    response(res, 200, '更新成功');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
