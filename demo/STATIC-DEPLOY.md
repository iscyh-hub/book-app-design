# 汇读 Demo · 静态版部署说明

> 本方案把 `demo/client` 前端改造为**纯 Mock 数据**，无需 Node.js 后端和 MySQL 数据库即可运行，适合直接部署到 GitHub Pages、Vercel、Netlify 等静态托管平台。

---

## 改造内容

1. **接口 Mock 化**：新增 `demo/client/src/api/mockData.js`，用本地数据替代所有后端 API
2. **图片本地化**：将 `demo/server/uploads/` 复制到 `demo/client/public/uploads/`，打包后随前端一起发布
3. **路由改为 HashRouter**：解决 GitHub Pages 等静态托管的刷新 404 问题
4. **移除后端代理**：`vite.config.js` 中删除 `/uploads` 代理配置
5. **GitHub Actions 自动部署**：新增两套工作流：
   - `.github/workflows/deploy-gh-pages-branch.yml`（推荐）：推送到 `main` 后自动构建并推送到 `gh-pages` 分支
   - `.github/workflows/deploy-demo.yml`（备用）：使用 GitHub Actions 作为 Source 直接部署

---

## 已支持的演示功能

- ✅ 登录 / 注册（模拟，任意账号密码均可登录）
- ✅ 书城首页（分类、搜索、热门推荐）
- ✅ 分类列表
- ✅ 图书详情（简介、章节目录）
- ✅ 章节阅读（字号调节、夜间模式、目录抽屉、上一章/下一章）
- ✅ 加入书架 / 移出书架 / 阅读进度保存（数据存在浏览器本地）
- ✅ 我的（个人信息、退出登录）
- ⚠️ 论坛模块仍为占位页

---

## 本地预览

```bash
cd demo/client
npm install
npm run build
npm run preview
```

浏览器访问 `http://localhost:4173`。

---

## 部署到 GitHub Pages（推荐：从分支部署）

这是实际验证过、设置页有明确 Save 按钮的方案。

1. 确保仓库里有 `.github/workflows/deploy-gh-pages-branch.yml` 文件
2. push 任意提交到 `main` 分支，触发工作流
3. 进入仓库 **Settings → Pages**
4. **Build and deployment** 区域：
   - **Source** 选择 **Deploy from a branch**
   - **Branch** 选择 `gh-pages` / `/(root)`
5. 点击 **Save**
6. 等待 1-2 分钟，访问 `https://iscyh-hub.github.io/book-app-design/`

> 如果修改了仓库名，同步修改 `.github/workflows/deploy-gh-pages-branch.yml` 中的 `VITE_BASE_URL`。

## 部署到 GitHub Pages（备用：GitHub Actions 作为 Source）

1. push 代码到 `main`
2. 进入 **Settings → Pages**
3. **Source** 选择 **GitHub Actions**
4. 忽略建议的 Jekyll / Static HTML 工作流，直接前往 Actions 页面运行 `Deploy Static Demo to GitHub Pages`

> 注意：新版 GitHub Pages 设置页可能把自定义工作流藏在建议工作流之后，找不到 Save 按钮时建议改用上面的"从分支部署"。

---

## 部署到 Vercel / Netlify（更简单）

1. 把代码 push 到 GitHub
2. 在 Vercel / Netlify 导入该仓库
3. 构建配置：
   - **Build command**: `cd demo/client && npm run build`
   - **Output directory**: `demo/client/dist`
   - **Base directory**: `/`（根目录）
4. 部署后即可获得 `https://xxx.vercel.app` 访问链接

> Vercel/Netlify 不需要修改 `VITE_BASE_URL`，保持默认 `/` 即可。

---

## 常见问题

### 1. 图片显示不出来？

确保 `demo/client/public/uploads/` 文件夹存在，且包含 `covers/`、`categories/`、`avatars/` 三个子目录。构建后 `dist/uploads/` 里应该有这些文件。

### 2. 刷新页面 404？

静态托管平台不支持 BrowserRouter 的客户端路由。本项目已改用 HashRouter，URL 会变成 `/#/book/1` 这种形式，刷新不会 404。

### 3. 想修改 Mock 数据？

编辑 `demo/client/src/api/mockData.js`，然后重新构建部署。

---

*生成时间：2026-07-07*
