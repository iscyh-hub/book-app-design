# 汇读 Demo 协作复盘

> 角色：实习技术产品经理（你）+ AI 工程助手
> 时间：2026-07-02
> 范围：`demo/` 前后端联调、 bug 修复与体验优化

---

## 一、整体目标

把基于 `docs/API-DESIGN.md` 与 `docs/DATABASE-DESIGN.md` 完成的 Demo 代码骨架，在本机 MySQL 环境跑通，并针对真机/桌面演示场景做体验打磨。

---

## 二、完成事项清单

| 序号 | 事项 | 关键文件 | 状态 |
|---|---|---|---|
| 1 | 读取 `HANDOFF.md`，了解当前完成度与待办 | `demo/HANDOFF.md` | ✅ 完成 |
| 2 | 安装/确认 MySQL 8 服务，配置后端数据库密码 | `demo/server/.env` | ✅ 完成 |
| 3 | 初始化数据库（14 张表 + 种子数据 + 测试用户） | `demo/server/seed/seed.js` | ✅ 完成 |
| 4 | 启动后端服务 | `demo/server/app.js` | ✅ 完成 |
| 5 | 启动前端服务 | `demo/client/vite.config.js` | ✅ 完成 |
| 6 | 修复图书列表接口 500 | `demo/server/routes/books.js` | ✅ 已解决 |
| 7 | 前端固定为移动端 App 尺寸 | `demo/client/src/index.css` | ✅ 已解决 |
| 8 | 图书详情页底部栏适配固定宽度 | `demo/client/src/pages/BookDetail.jsx` | ✅ 已解决 |
| 9 | 阅读页目录抽屉限制在 App 容器内 | `demo/client/src/pages/Reader.jsx` | ✅ 已解决 |
| 10 | 阅读页返回按钮逻辑修正 | `demo/client/src/pages/Reader.jsx` | ✅ 已解决 |
| 11 | 接入本地封面图、分类图、头像 | `demo/server/seed/seed.sql` | ✅ 已解决 |
| 12 | 修复首页分类文字与图标对齐 | `demo/client/src/pages/Home.jsx` | ✅ 已解决 |
| 13 | 移除书城首页无意义返回箭头 | `demo/client/src/pages/Home.jsx` | ✅ 已解决 |
| 14 | 为“聒聒”设置本地头像 | `demo/server/seed/seed.js` | ✅ 已解决 |

---

## 三、遇到的问题与解决方案

### 问题 1：MySQL 未安装，数据库初始化失败
- **现象**：首次运行 `npm run seed` 前，`mysql` 命令未找到，服务未启动。
- **解决**：你提供了 MySQL Installer 安装路径，确认 `MySQL80` 服务已运行，root 密码 `199966` 已填入 `.env`。
- **状态**：✅ 已解决

### 问题 2：`npm run seed` 报 `ER_UNSUPPORTED_PS`
- **现象**：`USE huidu` 在 `mysql2/promise` 的 `execute` 预处理语句中不支持。
- **解决**：将 `seed.js` 中的 `CREATE DATABASE`、`USE` 及 SQL 文件执行从 `connection.execute()` 改为 `connection.query()`。
- **状态**：✅ 已解决

### 问题 3：重复执行 `npm run seed` 报主键冲突
- **现象**：`ER_DUP_ENTRY: Duplicate entry '1' for key 'categories.PRIMARY'`
- **解决**：在 `seed.js` 建库前先执行 `DROP DATABASE IF EXISTS huidu`，让每次 seed 都是干净环境。
- **状态**：✅ 已解决

### 问题 4：图书列表接口 500（`ER_WRONG_ARGUMENTS`）
- **现象**：`LIMIT ? OFFSET ?` 的参数类型在 MySQL 预处理语句中不合法。
- **解决**：由于 `page`/`size` 已做 `parseInt` 校验，改为直接嵌入 SQL：`LIMIT ${size} OFFSET ${offset}`。
- **状态**：✅ 已解决

### 问题 5：前端在桌面浏览器全宽显示，不像 App
- **现象**：页面元素随浏览器宽度自适应，底部栏、抽屉都撑满屏幕。
- **解决**：
  - 新增 `index.css`，将 `#root` 居中、`.app` 限制 `max-width: 430px`；
  - 底部导航 `.bottom-nav`、图书详情操作栏 `.book-detail-actions` 均限制在 430px 内居中；
  - 阅读页目录抽屉通过 `getContainer={() => document.querySelector('.app')}` 挂载到 App 容器内。
- **状态**：✅ 已解决

### 问题 6：本地图片无法显示
- **现象**：封面、分类、头像改为 `/uploads/...` 后，前端请求 `localhost:5173/uploads/...` 404。
- **解决**：在 `vite.config.js` 增加 `proxy: { '/uploads': 'http://localhost:3001' }`，开发时自动转发到后端静态资源服务。
- **状态**：✅ 已解决

### 问题 7：阅读页返回逻辑错误
- **现象**：从第三章返回会回到第二章，与“上一章”按钮逻辑重复。
- **解决**：将 `NavBar onBack` 从 `navigate(-1)` 改为 `navigate(\`/book/${bookId}\`)`，统一返回图书详情页。
- **状态**：✅ 已解决

### 问题 8：书城首页分类文字与图标未对齐
- **现象**：文字与灰色方块/图标左右不齐。
- **解决**：将分类项外层 `div` 从 `textAlign: 'center'` 改为 `display: flex; flex-direction: column; align-items: center`。
- **状态**：✅ 已解决

---

## 四、待后续决策/未彻底闭环事项

1. **部署与 HTTPS**
   - 当前为本地 HTTP 演示，云服务器部署后再配 HTTPS。
   - 状态：⏸ 未在本次处理

2. **未实现模块**
   - 购物车、订单、支付、论坛仍为占位或未实现。
   - 状态：⏸ 需产品排期

3. **图片资源管理**
   - 当前通过 `seed.sql` 硬编码路径，批量上传/后台管理功能未做。
   - 状态：⏸ MVP 外需求

4. **端口占用清理**
   - 开发过程中多次出现旧前端进程占用 5173/5174/5175，需手动 kill。
   - 状态：✅ 已解决，但建议后续用固定脚本或 `npx kill-port` 管理

---

## 五、经验小结（给产品经理视角）

1. **Handoff 文档的价值**：`HANDOFF.md` 让接手成本显著降低，建议后续每次交接都保留类似“状态 + 待办 + 文件速查”三段式结构。
2. **MVP 边界要清晰**：封面、分类图、头像属于“演示体验”，可晚于核心接口；但接口 500 属于阻塞性问题，必须优先修。
3. **真机演示要提前考虑固定尺寸**：如果在桌面浏览器演示移动 App，尽早把 `max-width` 和容器居中定下来，避免反复调整多个组件。
4. **本地资源路径要统一**：静态资源统一走 `/uploads`，并通过 dev proxy 或 CDN 域名解决前后端端口不一致问题，避免前端代码里写死后端地址。

---

## 六、当前可访问地址

- 前端：`http://localhost:5173`
- 后端：`http://localhost:3001`
- 测试账号：`test / 123456`（昵称：聒聒）
