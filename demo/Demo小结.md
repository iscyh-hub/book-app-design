# 汇读 APP 可运行 Demo

基于 `docs/API-DESIGN.md` 和 `docs/DATABASE-DESIGN.md` 实现的最小可用 Demo。

## 技术栈

- 前端：Vite + React + Ant Design Mobile
- 后端：Node.js + Express + MySQL
- 协议：HTTP + JSON（本地演示），JWT Bearer Token 鉴权

## 已实现功能

- 用户注册 / 登录 / 我的
- 书城首页、分类浏览、图书搜索
- 图书详情、章节目录
- 章节阅读（字号、夜间模式、目录、上一章/下一章）
- 加入书架 / 移除书架 / 阅读进度保存

## 环境要求

- Node.js 18+
- MySQL 8

## 快速启动

### 1. 初始化数据库

```bash
cd demo/server
npm install
# 根据实际情况修改 .env 中的 DB_PASSWORD
npm run seed
```

### 2. 启动后端

```bash
cd demo/server
npm run dev
```

后端默认运行在 `http://localhost:3001`。

### 3. 启动前端

```bash
cd demo/client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。

### 4. 手机同 Wi-Fi 访问

- 获取电脑局域网 IP；
- 修改 `demo/client/.env` 中的 `VITE_API_BASE_URL` 为 `http://<电脑IP>:3001`；
- 手机浏览器访问 `http://<电脑IP>:5173`。

## 测试账号

- 用户名：`test`
- 密码：`123456`
- 昵称：`聒聒`

## 项目结构

```
demo/
├── client/     # React 前端
└── server/     # Express 后端 + MySQL 初始化脚本
```

**复盘**

1. **整体目标** —— 把 Demo 骨架在本机跑通并做演示体验打磨。
2. **完成事项清单** —— 14 项，涵盖环境配置、接口修复、UI 调整、图片接入。
3. **遇到的问题与解决方案** —— 8 个核心问题，例如：

   * 当前环境下MySQL 未安装 / seed 预处理语句报错
   * 图书列表 500
   * 前端全宽显示、抽屉越界
   * 本地图片 404
   * 返回逻辑与上一章重复
   * 分类文字与图标未对齐
4. **待后续决策事项** —— HTTPS（当前为本地 HTTP 演示，云服务器部署后再配 HTTPS）、未实现模块、图片资源管理（当前通过 `seed.sql` 硬编码路径，批量上传/后台管理功能未做）、开发端口管理。
5. **经验小结** —— Handoff（交接说明）、MVP 边界、固定尺寸、资源路径四点建议。

   1. Handoff 文档的价值：`HANDOFF.md` 让接手成本显著降低，建议后续每次交接都保留类似“状态 + 待办 + 文件速查”三段式结构。
   2. MVP 边界要清晰：封面、分类图、头像属于“演示体验”，可晚于核心接口；但接口 500 属于阻塞性问题，必须优先修。
   3. 真机演示要提前考虑固定尺寸：如果在桌面浏览器演示移动 App，尽早把 `max-width` 和容器居中定下来，避免反复调整多个组件。
   4. 本地资源路径要统一：静态资源统一走 `/uploads`，并通过 dev proxy 或 CDN 域名解决前后端端口不一致问题，避免前端代码里写死后端地址。
6. **当前可访问地址** —— 前端 `5173`、后端 `3001`、测试账号 `test / 123456`
