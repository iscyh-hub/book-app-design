# 汇读 Demo 交接说明（Handoff）

## 当前状态

已基于 `docs/API-DESIGN.md` 和 `docs/DATABASE-DESIGN.md` 完成 Demo 的代码骨架与核心功能实现。前端已能成功构建，后端可正常启动。

当前环境（本机）尚未安装 MySQL，因此**数据库初始化与端到端联调还未跑通**。你只需安装 MySQL 后按下方步骤执行即可。

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

---

## 你接下来要做的

### 1. 安装 MySQL 8

推荐下载官方 Installer：
https://dev.mysql.com/downloads/installer/

安装时记住 root 密码，并确保 MySQL 服务在运行。

### 2. 配置后端数据库密码

编辑 `demo/server/.env`：

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的root密码
DB_NAME=huidu
JWT_SECRET=huidu_demo_secret_key_2024
```

### 3. 初始化数据库

```bash
cd demo/server
npm install        # 如果还没装
npm run seed
```

成功后，MySQL 中会出现 `huidu` 数据库、14 张表、6 本书、18 个章节、1 个测试用户 `test / 123456`（昵称：聒聒）。

### 4. 启动后端

```bash
cd demo/server
npm run dev
```

看到 `汇读后端服务已启动: http://localhost:3001` 即成功。

### 5. 启动前端

新开一个终端：

```bash
cd demo/client
npm install        # 如果还没装
npm run dev
```

浏览器访问 `http://localhost:5173`。

### 6. 真机演示（可选）

- 电脑和手机连同一 Wi-Fi；
- 获取电脑局域网 IP（`ipconfig`）；
- 修改 `demo/client/.env` 中的 `VITE_API_BASE_URL` 为 `http://<电脑IP>:3001`；
- 手机浏览器访问 `http://<电脑IP>:5173`。

---

## 已知问题 / 注意事项

1. **封面图使用的是 `placehold.co` 在线占位图**。如果你要在无网络环境演示，需要把 `书籍插图/` 里的图片复制到 `demo/server/uploads/covers/`，并修改 `seed/seed.sql` 中的 `cover` 字段为本地路径。
2. **未接真实支付**：购物车、订单、支付模块在 MVP 中未实现，论坛也是占位状态。
3. **静态资源**：`demo/server/uploads/` 目前为空，后端已配置 `/uploads` 静态资源路由，后续可直接放本地图片。
4. **HTTPS**：本地演示用 HTTP，部署到云服务器后再配 HTTPS。

---

## 文件速查

| 文件 | 作用 |
|---|---|
| `demo/server/app.js` | 后端入口 |
| `demo/server/.env` | 后端环境变量（需填写 DB 密码） |
| `demo/server/seed/init.sql` | 14 张建表 SQL |
| `demo/server/seed/seed.sql` | 种子数据 |
| `demo/server/routes/*.js` | 各模块接口实现 |
| `demo/client/.env` | 前端 API 地址 |
| `demo/client/src/router.jsx` | 前端路由 |
| `demo/client/src/api/*.js` | 前端 API 封装 |
| `demo/client/src/pages/*.jsx` | 前端页面 |
| `demo/README.md` | 运行说明 |

---

*生成时间：2026-07-02*
