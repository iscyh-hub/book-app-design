require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/books', require('./routes/books'));
app.use('/api/bookshelf', require('./routes/bookshelf'));
app.use('/api/reading', require('./routes/reading'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'ok', data: null });
});

// 错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`汇读后端服务已启动: http://localhost:${PORT}`);
});
