# 汇读 Demo 协作复盘

> 角色：实习技术产品经理（你）+ AI 工程助手
> 时间：2026-07-02 ~ 2026-07-08
> 范围：`demo/` 前后端联调、静态版部署、bug 修复与体验优化

---

## 一、整体目标

把基于 `docs/API-DESIGN.md` 与 `docs/DATABASE-DESIGN.md` 完成的 Demo 代码骨架，在本机 MySQL 环境跑通，并针对真机/桌面演示场景做体验打磨。

---

## 二、完成事项清单

| 序号 | 事项                                          | 关键文件                                 | 状态      |
| ---- | --------------------------------------------- | ---------------------------------------- | --------- |
| 1    | 读取`HANDOFF.md`，了解当前完成度与待办      | `demo/HANDOFF.md`                      | ✅ 完成   |
| 2    | 安装/确认 MySQL 8 服务，配置后端数据库密码    | `demo/server/.env`                     | ✅ 完成   |
| 3    | 初始化数据库（14 张表 + 种子数据 + 测试用户） | `demo/server/seed/seed.js`             | ✅ 完成   |
| 4    | 启动后端服务                                  | `demo/server/app.js`                   | ✅ 完成   |
| 5    | 启动前端服务                                  | `demo/client/vite.config.js`           | ✅ 完成   |
| 6    | 修复图书列表接口 500                          | `demo/server/routes/books.js`          | ✅ 已解决 |
| 7    | 前端固定为移动端 App 尺寸                     | `demo/client/src/index.css`            | ✅ 已解决 |
| 8    | 图书详情页底部栏适配固定宽度                  | `demo/client/src/pages/BookDetail.jsx` | ✅ 已解决 |
| 9    | 阅读页目录抽屉限制在 App 容器内               | `demo/client/src/pages/Reader.jsx`     | ✅ 已解决 |
| 10   | 阅读页返回按钮逻辑修正                        | `demo/client/src/pages/Reader.jsx`     | ✅ 已解决 |
| 11   | 接入本地封面图、分类图、头像                  | `demo/server/seed/seed.sql`            | ✅ 已解决 |
| 12   | 修复首页分类文字与图标对齐                    | `demo/client/src/pages/Home.jsx`       | ✅ 已解决 |
| 13   | 移除书城首页无意义返回箭头                    | `demo/client/src/pages/Home.jsx`       | ✅ 已解决 |
| 14   | 为“聒聒”设置本地头像                        | `demo/server/seed/seed.js`             | ✅ 已解决 |
| 15   | 修复 GitHub Pages 静态版图片 404              | `demo/client/src/api/mockData.js`<br>`demo/client/src/api/request.js` | ✅ 已解决 |

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

### 问题 9：关闭 CMD 窗口后页面无法打开

- **现象**：开发过程中关闭启动前后端的 CMD 窗口后，再次访问 `http://localhost:5173` 提示无法访问此网站/页面空白；前端或后端服务已随 CMD 进程退出。
- **解决**：重新在工作目录下启动前后端服务：
  - 后端：`cd /d f:\本科\毕设\prd\demo\server && npm run dev`
  - 前端：`cd /d f:\本科\毕设\prd\demo\client && npm run dev`
- **状态**：✅ 已解决

### 问题 10：GitHub Pages 自动部署失败 / Pages 设置界面找不到 Save

- **现象**：
  1. 将静态版 Demo push 到 `main` 后，收到 GitHub 邮件提示 `Deploy Static Demo to GitHub Pages` 工作流失败。
  2. 进入仓库 **Settings → Pages** 后，界面显示的是 `Use a suggested workflow, browse all workflows, or create your own`，并列出 `GitHub Pages Jekyll` / `Static HTML` 两个建议工作流，找不到明确的 Save 按钮。
- **根因**：
  1. 仓库此前未启用 GitHub Pages，导致 `actions/deploy-pages` 无法部署。
  2. GitHub 新版 Pages 设置页默认引导用户选择建议工作流，而我们已有的自定义工作流文件（`.github/workflows/deploy-demo.yml`）没有出现在该引导页中，造成困惑。
- **解决**：
  1. 改为**从分支部署**方案：新增 `.github/workflows/deploy-gh-pages-branch.yml`，每次 push 到 `main` 时自动构建 `demo/client` 并将 `dist/` 推送到 `gh-pages` 分支。
  2. 在 **Settings → Pages** 中：
     - **Source** 选择 **Deploy from a branch**
     - **Branch** 选择 `gh-pages` / `/(root)`
     - 点击 **Save**
  3. 重新触发工作流后，`pages build and deployment` 与 `Deploy Static Demo to gh-pages Branch` 均成功，站点可访问。
- **状态**：✅ 已解决

### 问题 11：GitHub Pages 静态版 Demo 图片无法显示

- **现象**：静态版 Demo 部署到 `https://iscyh-hub.github.io/book-app-design/` 后，封面、分类图标、用户头像均无法显示；本地前后端联调时图片正常。
- **根因**：GitHub Pages 将站点部署在仓库子路径 `/book-app-design/` 下，而 `mockData.js` 中图片路径写成了根目录绝对路径 `/uploads/...`，浏览器解析为 `github.io/uploads/...`，导致 404。
- **解决**：
  1. 在 `demo/client/src/api/mockData.js` 中添加 `asset()` 辅助函数，使用 Vite 的 `import.meta.env.BASE_URL` 拼接资源路径：
     - 本地开发时 `BASE_URL` 为 `/`，图片路径为 `/uploads/...`；
     - GitHub Pages 构建时 `BASE_URL` 为 `/book-app-design/`，图片路径为 `/book-app-design/uploads/...`。
  2. 同步修复 `demo/client/src/api/request.js` 中 401 跳转 `/login` 的硬编码路径，改为 `import.meta.env.BASE_URL + 'login'`，避免登录页在子路径部署下也跳错。
- **状态**：✅ 已解决

---

## 四、待后续决策/未彻底闭环事项

1. **部署**

   - ✅ 静态版 Demo 已通过 GitHub Pages 部署：`https://iscyh-hub.github.io/book-app-design/`
   - ⏸ 云服务器 + 自定义域名 + HTTPS 部署尚未处理，如需正式产品化再考虑。
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
5. **GitHub Pages 部署优先选“从分支部署”**：新版 Pages 设置页对自定义工作流引导不够直观，建议直接用 `gh-pages` 分支 + `peaceiris/actions-gh-pages` 工作流，设置页有明确的 Save 按钮，成功率更高。
6. **子路径部署下要避免硬编码根路径**：当站点部署在 GitHub Pages 等子路径（如 `/book-app-design/`）时，图片、跳转链接等静态资源应使用 Vite 的 `import.meta.env.BASE_URL` 动态拼接，避免本地正常、线上 404。

---

## 六、当前可访问地址

- **线上静态版 Demo**：`https://iscyh-hub.github.io/book-app-design/`
- **本地开发前端**：`http://localhost:5173`
- **本地开发后端**：`http://localhost:3001`
- **测试账号**：`test / 123456`（昵称：聒聒）

## 七、项目重新启动命令

> 适用于关闭 CMD 后需要重新启动开发环境，或换电脑/目录后首次启动。

### 1. 启动后端服务

在 CMD 中执行：

```cmd
cd /d f:\本科\毕设\prd\demo\server
npm run dev
```

- 启动成功后，后端运行在 `http://localhost:3001`
- 如需重置数据库，可执行 `npm run seed`

### 2. 启动前端服务

再开一个 CMD 窗口，执行：

```cmd
cd /d f:\本科\毕设\prd\demo\client
npm run dev
```

- 启动成功后，Vite 会输出前端访问地址（通常为 `http://localhost:5173`）
- 开发时前端会自动代理 `/uploads` 到后端，无需额外配置

### 3. 浏览器访问

打开：`http://localhost:5173`

### 注意事项

- 前后端各需一个 CMD 窗口，**不要关闭**，关闭即停止服务。
- 若提示端口被占用，可先用 `npx kill-port 5173 3001` 清理后再启动。
- 若提示 `npm 不是内部或外部命令`，需检查 Node.js 环境变量是否配置正确。
