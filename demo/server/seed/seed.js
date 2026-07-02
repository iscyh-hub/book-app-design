require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'huidu';

  // 连接时不指定 database，先建库
  const connection = await mysql.createConnection({ host, port, user, password, charset: 'utf8mb4' });
  console.log('连接 MySQL 成功');

  await connection.query(`DROP DATABASE IF EXISTS ${database}`);
  await connection.query(`CREATE DATABASE ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.query(`USE ${database}`);
  console.log(`数据库 ${database} 已就绪`);

  // 执行建表 SQL
  const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  const statements = initSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await connection.query(stmt + ';');
  }
  console.log('14 张数据表已创建');

  // 插入种子数据
  const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  const seedStatements = seedSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of seedStatements) {
    await connection.query(stmt + ';');
  }
  console.log('种子数据已插入');

  // 创建测试用户：test / 123456
  const hashed = await bcrypt.hash('123456', 10);
  await connection.execute(
    `INSERT INTO users (username, password, nickname, avatar) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password = VALUES(password), nickname = VALUES(nickname)`,
    ['test', hashed, '聒聒', '/uploads/avatars/头像.jpg']
  );
  console.log('测试用户已创建：test / 123456');

  await connection.end();
  console.log('初始化完成');
}

run().catch((err) => {
  console.error('初始化失败:', err);
  process.exit(1);
});
