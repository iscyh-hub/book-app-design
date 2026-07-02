# 汇读 Demo 运行说明

> 本目录为「汇读」智能阅读服务系统的可运行前后端 Demo，用于验证产品方案与毕业设计演示。

---

## 一、技术栈

| 端   | 技术                              |
| ---- | --------------------------------- |
| 前端 | Vite 5 + React 18 + Ant Design Mobile |
| 后端 | Node.js + Express + MySQL 8       |
| 鉴权 | JWT                               |

---

## 二、已覆盖功能

- [x] 用户注册 / 登录 / JWT 鉴权
- [x] 书城首页（搜索、分类、热门推荐）
- [x] 分类列表
- [x] 图书详情（加入书架、开始阅读）
- [x] 章节阅读（目录抽屉、字号调节、夜间模式、上一章/下一章、进度保存）
- [x] 我的书架
- [x] 我的（个人信息、退出登录）
- [x] 论坛入口（占位）

**未实现 / 占位**：购物车、订单、支付、论坛完整功能。

---

## 三、环境准备

1. 安装 **Node.js**（建议 v18+）
2. 安装 **MySQL 8** 并启动服务
3. 记住 MySQL 的 **root 密码**

---

## 四、快速启动

### 1. 配置后端数据库密码

```bash
cd demo/server
```

将 `.env` 中的 `DB_PASSWORD` 改为你本机的 root 密码：

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的root密码
DB_NAME=huidu
JWT_SECRET=huidu_demo_secret_key_2024
```

### 2. 初始化数据库并启动后端

```bash
npm install
npm run seed
npm run dev
```

看到 `汇读后端服务已启动: http://localhost:3001` 即成功。

### 3. 启动前端

新开一个终端：

```bash
cd demo/client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。

---

## 五、测试账号

- 用户名：`test`
- 密码：`123456`
- 昵称：聒聒

---

## 六、演示说明

### 6.1 固定 App 尺寸

前端已限制最大宽度为 **430px** 并居中显示，适合：

- 在桌面浏览器直接查看（模拟手机界面）；
- 同一局域网内用手机浏览器访问电脑 IP（需将 `demo/client/.env` 中的 `VITE_API_BASE_URL` 改为 `http://<电脑IP>:3001`）。

### 6.2 本地图片资源

封面、分类、头像等图片已接入本地资源，存放于：

- `demo/server/uploads/covers/` —— 图书封面
- `demo/server/uploads/categories/` —— 分类图标
- `demo/server/uploads/avatars/` —— 用户头像

开发环境下，`/uploads` 请求会通过 Vite 代理转发到后端 `http://localhost:3001`。

### 6.3 重新初始化数据

如需重置数据库（例如修改了 `seed.sql` 中的图片路径）：

```bash
cd demo/server
npm run seed
```

该命令会先 `DROP DATABASE IF EXISTS huidu`，再重新建库、建表、插数据。

---

## 七、目录结构

```
demo/
├── client/          # React 前端
│   ├── src/
│   │   ├── api/     # 接口封装
│   │   ├── pages/   # 页面组件
│   │   ├── components/  # 公共组件
│   │   └── index.css    # 全局样式（固定 App 尺寸）
│   ├── .env         # 前端环境变量
│   └── vite.config.js
├── server/          # Express 后端
│   ├── app.js       # 后端入口
│   ├── routes/      # 接口路由
│   ├── seed/        # 数据库初始化脚本
│   ├── uploads/     # 静态资源
│   └── .env         # 后端环境变量
└── README.md        # 本文件
```

---

## 八、常见问题

### 1. `npm run seed` 提示 `ER_UNSUPPORTED_PS`

已修复：`seed.js` 中使用 `connection.query()` 而非 `connection.execute()` 执行 `USE` 与 SQL 文件。

### 2. 图书列表接口报 500（`LIMIT ? OFFSET ?`）

已修复：`books.js` 中将 `LIMIT`/`OFFSET` 直接嵌入已校验的整数。

### 3. 本地图片无法显示

已配置：`demo/client/vite.config.js` 中已将 `/uploads` 代理到后端。

### 4. 前端端口被占用

开发过程中若 5173 被旧进程占用，可：

```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

或让 Vite 自动尝试其他端口。

---

## 九、协作记录

本次 Demo 的开发过程、问题与解决方案已整理在：

> `docs/CO-WORKING-REVIEW.md`

---

*最后更新：2026-07-02*
