# 汇读 Demo 交接说明（Handoff）

## 当前状态

已基于 `docs/API-DESIGN.md` 和 `docs/DATABASE-DESIGN.md` 完成 Demo 的代码骨架与核心功能实现。**本机 MySQL 已安装，数据库已初始化，前后端已联调通过；静态版 Demo 已部署到 GitHub Pages。**

- 在线静态版：`https://iscyh-hub.github.io/book-app-design/`
- 本地开发前端：`http://localhost:5173`
- 本地开发后端：`http://localhost:3001`
- 测试账号：`test / 123456`（昵称：聒聒）

---

## 已完成内容

### 后端（`demo/server/`）

- Express 骨架：`app.js`、数据库连接池、JWT 鉴权中间件、统一错误处理
- 已实现 MVP 接口：
  - `POST /api/users/register` 注册
  - `POST /api/users/login` 登录
  - `GET /api/users/profile` 我的信息
  - `GET /api/categories` 分类列表
  - `GET /api/books` 图书列表（分页 / 分类 / 搜索）
  - `GET /api/books/:id` 图书详情 + 章节目录
  - `GET /api/books/:id/chapters/:cid` 章节正文
  - `POST /api/reading/progress` 保存阅读进度
  - `GET /api/bookshelf` 我的书架
  - `POST /api/bookshelf` 加入书架
  - `DELETE /api/bookshelf/:book_id` 移出书架
- 数据库脚本：
  - `seed/init.sql` — 14 张表（复用 `docs/DATABASE-DESIGN.md`）
  - `seed/seed.sql` — 6 本公版书、3 章/本、5 个分类
  - `seed/seed.js` — 一键建库、建表、插数据、创建测试用户
- 已修复问题：
  - `seed.js` 使用 `connection.query()` 执行 `USE` 与 SQL 文件，避免 `ER_UNSUPPORTED_PS`
  - `seed.js` 每次运行先 `DROP DATABASE IF EXISTS huidu`，避免重复初始化主键冲突
  - `routes/books.js` 修复 `LIMIT ? OFFSET ?` 预处理参数类型错误

### 前端（`demo/client/`）

- Vite + React + Ant Design Mobile 项目
- 已构建通过（`npm run build` 成功）
- 已实现的页面：
  - 登录 / 注册
  - 书城首页（搜索 + 分类 + 热门推荐）
  - 分类列表
  - 图书详情
  - 章节阅读（字号、夜间模式、目录抽屉、上一章/下一章、进度保存）
  - 我的书架
  - 我的（个人信息、退出登录）
  - 论坛（占位）
- 已修复 / 优化：
  - 前端固定为移动端 App 尺寸（最大宽度 430px，居中显示）
  - 底部导航、图书详情底部操作栏限制在 App 容器宽度内
  - 阅读页目录抽屉挂载到 `.app` 容器，从 App 左侧滑出
  - 阅读页返回按钮统一回到图书详情页
  - 书城首页分类文字与图标居中对齐
  - 移除书城首页无意义的返回箭头
  - `vite.config.js` 增加 `/uploads` 代理到后端，本地图片可正常显示

### 图片资源

- 封面图：已接入本地 `demo/server/uploads/covers/`
- 分类图标：已接入本地 `demo/server/uploads/categories/`
- 测试用户头像：已接入本地 `demo/server/uploads/avatars/`

---

## 启动方式

### 1. 确认 MySQL 8 服务在运行

确保 root 密码与 `demo/server/.env` 中 `DB_PASSWORD` 一致。

### 2. 启动后端

```bash
cd demo/server
npm install        # 如果还没装
npm run seed       # 如需重置数据库
npm run dev
```

看到 `汇读后端服务已启动: http://localhost:3001` 即成功。

### 3. 启动前端

新开一个终端：

```bash
cd demo/client
npm install        # 如果还没装
npm run dev
```

浏览器访问 `http://localhost:5173`。

### 4. 真机演示（可选）

- 电脑和手机连同一 Wi-Fi；
- 获取电脑局域网 IP（`ipconfig`）；
- 修改 `demo/client/.env` 中的 `VITE_API_BASE_URL` 为 `http://<电脑IP>:3001`；
- 手机浏览器访问 `http://<电脑IP>:5173`。

---

## 已知问题 / 注意事项

1. **静态版 Demo**：GitHub Pages 部署的是 Mock 数据版，登录、书架、阅读进度均模拟实现，数据保存在浏览器本地；购物车、订单、支付、论坛仍为占位或未实现。
2. **全栈版仍需本地运行**：如果需要真实后端 + MySQL，仍需按下方"启动方式"在本地启动前后端。
3. **HTTPS**：本地演示用 HTTP，部署到云服务器后再配 HTTPS。
4. **图片资源**：已改为本地静态资源，存放于 `demo/server/uploads/` 和 `demo/client/public/uploads/`，如需新增图片可直接放入对应目录并修改 `seed/seed.sql` 或 `demo/client/src/api/mockData.js`。
5. **数据库重置**：`npm run seed` 会删除并重建 `huidu` 数据库，生产环境请勿使用。

---

## 文件速查

| 文件 | 作用 |
|---|---|
| `demo/server/app.js` | 后端入口 |
| `demo/server/.env` | 后端环境变量（需填写 DB 密码） |
| `demo/server/seed/init.sql` | 14 张建表 SQL |
| `demo/server/seed/seed.sql` | 种子数据 |
| `demo/server/seed/seed.js` | 一键初始化数据库 |
| `demo/client/.env` | 前端 API 地址 |
| `demo/client/vite.config.js` | Vite 配置 |
| `demo/client/src/router.jsx` | 前端路由 |
| `demo/client/src/api/*.js` | 前端 API 封装 |
| `demo/client/src/api/mockData.js` | 静态版 Mock 数据 |
| `demo/client/src/pages/*.jsx` | 前端页面 |
| `demo/client/public/uploads/` | 静态版图片资源 |
| `demo/client/src/index.css` | 全局样式（固定 App 尺寸） |
| `.github/workflows/deploy-gh-pages-branch.yml` | GitHub Pages 分支部署工作流 |
| `.github/workflows/deploy-demo.yml` | GitHub Actions Source 部署工作流（备用） |
| `demo/README.md` | Demo 运行说明 |
| `demo/STATIC-DEPLOY.md` | 静态版部署说明 |
| `demo/HANDOFF.md` | 本文件 |
| `docs/CO-WORKING-REVIEW.md` | 开发协作复盘 |
| `README.md` | 项目总览（含 Demo 介绍） |

---

*生成时间：2026-07-07（静态版已部署至 GitHub Pages）*
