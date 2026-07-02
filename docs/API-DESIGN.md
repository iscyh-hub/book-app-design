# 汇读 · 智能阅读服务系统 —— 接口设计文档

> 本文档定义「汇读」APP（Android / iOS）与后端服务之间的 RESTful API 接口规范，覆盖用户、图书、阅读、书架、订单、论坛等核心模块。
>
> 说明：本方案以移动 APP 为首要设计目标，接口采用 HTTPS + JSON，同样适用于小程序 / H5 等移动端场景。

---

## 一、接口设计规范

### 1.1 基础约定

| 项       | 约定                                                                  |
| -------- | --------------------------------------------------------------------- |
| 协议     | **HTTPS**（加密传输）                                                 |
| 数据格式 | JSON                                                                  |
| 字符编码 | UTF-8                                                                 |
| 鉴权方式 | Bearer Token（JWT）                                                   |
| 请求头   | `Content-Type: application/json`、`Authorization: Bearer {token}` |
| 基础路径 | `https://api.huidu.example.com/v1`                                  |

### 1.2 API 是什么？

APP 本身不存储业务数据，所有数据都保存在后端服务器和数据库中。**API 就是 APP 与后端之间的「对话框」**。

以书城首页为例：

```
APP：我要看首页书城列表
后端：好，这是 20 本书的 JSON 数据
```

APP 拿到 JSON 后，解析并渲染成图书卡片。

### 1.3 RESTful 设计思想

| HTTP 方法 | 含义   | 示例                                         |
| --------- | ------ | -------------------------------------------- |
| GET       | 获取   | `GET /api/books` 获取图书列表                |
| POST      | 创建   | `POST /api/orders` 创建订单                  |
| PUT       | 更新   | `PUT /api/cart/{cart_id}` 更新购物车商品     |
| DELETE    | 删除   | `DELETE /api/bookshelf/{book_id}` 移出书架   |

**设计原则**：URL 表示资源，HTTP 方法表示对资源的操作。

### 1.4 登录态如何保持？JWT Token

APP 没有浏览器 cookie，所以采用 Token 机制：

1. 用户登录：`POST /api/users/login`
2. 后端验证账号密码，返回 `token`
3. APP 把 `token` 存在本地
4. 之后访问需要登录的接口（书架、订单等），在请求头里带上：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 1.5 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段        | 说明                   |
| ----------- | ---------------------- |
| `code`    | 业务状态码，200 为成功 |
| `message` | 提示信息               |
| `data`    | 响应数据               |

APP 前端统一判断：

```js
if (response.code === 200) {
  // 渲染 response.data
} else {
  // 显示 response.message 错误提示
}
```

### 1.6 常见状态码

| HTTP 状态码 | 含义                                                         |
| ----------- | ------------------------------------------------------------ |
| 200         | 请求成功                                                     |
| 400         | 参数错误，例如必填字段未传                                   |
| 401         | 未登录或 Token 失效                                          |
| 403         | 无权限，例如访问他人订单                                     |
| 404         | 资源不存在，例如 `book_id` 不存在                            |
| 500         | 服务器内部错误                                               |

---

## 二、API 与 APP 页面对照

| APP 页面             | 调用接口                                                   | 作用说明                         |
| -------------------- | ---------------------------------------------------------- | -------------------------------- |
| 登录 / 注册页        | `POST /api/users/register`、`POST /api/users/login`      | 注册账号、登录获取 token         |
| 书城首页             | `GET /api/categories`、`GET /api/books`                  | 分类、图书列表、排行榜           |
| 图书详情页           | `GET /api/books/{id}`                                    | 显示图书信息、简介、章节列表     |
| 电子书阅读页         | `GET /api/books/{id}/chapters/{cid}`                     | 加载章节正文                     |
| 听书页               | `GET /api/books/{id}/chapters/{cid}`                     | 获取 `audio_url` 播放音频        |
| 书架页               | `GET /api/bookshelf`                                     | 我的书架、最近阅读               |
| 笔记页               | `GET /api/notes`、`POST /api/notes`                      | 查看、创建阅读笔记               |
| 购物车页             | `GET /api/cart`、`POST /api/cart`、`PUT /api/cart/{id}`  | 购物车列表、添加、修改数量       |
| 结算页               | `POST /api/orders`                                       | 创建订单                         |
| 支付页               | `POST /api/orders/{id}/pay`                              | 订单支付                         |
| 订单列表页           | `GET /api/orders`                                        | 查看历史订单                     |
| 论坛首页             | `GET /api/posts`                                         | 帖子列表                         |
| 帖子详情页           | `GET /api/posts/{id}`、`POST /api/posts/{id}/comments`   | 帖子内容、发表评论               |
| 我的页               | `GET /api/users/profile`、`GET /api/reading/statistics`  | 个人信息、阅读统计               |

---

## 三、用户模块

### 3.1 用户注册

```http
POST /api/users/register
```

**请求参数：**

```json
{
  "username": "guoguo",
  "password": "123456",
  "nickname": "聒聒"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": 1,
    "username": "guoguo",
    "nickname": "聒聒"
  }
}
```

### 3.2 用户登录

```http
POST /api/users/login
```

**请求参数：**

```json
{
  "username": "guoguo",
  "password": "123456"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user_id": 1,
    "nickname": "聒聒",
    "avatar": "https://cdn.example.com/avatar/1.jpg",
    "is_vip": 0,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3.3 获取用户信息

```http
GET /api/users/profile
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": 1,
    "username": "guoguo",
    "nickname": "聒聒",
    "avatar": "https://cdn.example.com/avatar/1.jpg",
    "email": "guoguo@example.com",
    "phone": "13800138000",
    "is_vip": 1,
    "vip_expire_date": "2024-12-31 23:59:59"
  }
}
```

### 3.4 更新用户信息

```http
PUT /api/users/profile
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "nickname": "聒聒爱读书",
  "avatar": "https://cdn.example.com/avatar/1.jpg",
  "email": "guoguo@example.com"
}
```

---

## 四、图书模块

### 4.1 获取图书分类

```http
GET /api/categories
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "category_id": 1,
      "parent_id": 0,
      "name": "文学",
      "icon": "https://cdn.example.com/category/literature.png"
    },
    {
      "category_id": 2,
      "parent_id": 0,
      "name": "科技",
      "icon": "https://cdn.example.com/category/tech.png"
    }
  ]
}
```

### 4.2 获取图书列表

```http
GET /api/books?page=1&size=20&category_id=1&keyword=简爱&sort=newest
```

**请求参数：**

| 参数            | 类型   | 必填 | 说明                              |
| --------------- | ------ | ---- | --------------------------------- |
| `page`        | int    | 否   | 页码，默认 1                      |
| `size`        | int    | 否   | 每页数量，默认 20                 |
| `category_id` | int    | 否   | 分类 ID                           |
| `keyword`     | string | 否   | 搜索关键词                        |
| `sort`        | string | 否   | 排序：newest/hottest/best_selling |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 156,
    "page": 1,
    "size": 20,
    "list": [
      {
        "book_id": 1,
        "title": "简爱",
        "author": "夏洛蒂·勃朗特",
        "cover": "https://cdn.example.com/covers/jianai.jpg",
        "category_id": 1,
        "price": 19.90,
        "original_price": 39.80,
        "is_ebook": 1,
        "is_audiobook": 1
      }
    ]
  }
}
```

### 4.3 获取图书详情

```http
GET /api/books/{book_id}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "book_id": 1,
    "title": "简爱",
    "author": "夏洛蒂·勃朗特",
    "cover": "https://cdn.example.com/covers/jianai.jpg",
    "category_id": 1,
    "price": 19.90,
    "original_price": 39.80,
    "is_ebook": 1,
    "is_audiobook": 1,
    "summary": "《简·爱》是十九世纪英国著名的女作家夏洛蒂·勃朗特的代表作...",
    "word_count": 420000,
    "chapters": [
      {
        "chapter_id": 1,
        "chapter_no": 1,
        "title": "第一章 盖茨黑德府",
        "is_free": 1
      }
    ]
  }
}
```

---

## 五、阅读模块

### 5.1 获取章节内容

```http
GET /api/books/{book_id}/chapters/{chapter_id}
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "chapter_id": 1,
    "chapter_no": 1,
    "title": "第一章 盖茨黑德府",
    "content": "那天，再出去散步是不可能了...",
    "audio_url": "https://cdn.example.com/audio/jianai/01.mp3",
    "is_free": 1,
    "prev_chapter_id": null,
    "next_chapter_id": 2
  }
}
```

### 5.2 保存阅读进度

```http
POST /api/reading/progress
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "book_id": 1,
  "chapter_id": 1,
  "position": 1250,
  "progress": 15
}
```

### 5.3 记录阅读时长

```http
POST /api/reading/records
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "book_id": 1,
  "chapter_id": 1,
  "duration": 600
}
```

---

## 六、书架模块

### 6.1 获取我的书架

```http
GET /api/bookshelf?page=1&size=20
Authorization: Bearer {token}
```

### 6.2 加入书架

```http
POST /api/bookshelf
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "book_id": 1,
  "is_favorite": 1
}
```

### 6.3 移出书架

```http
DELETE /api/bookshelf/{book_id}
Authorization: Bearer {token}
```

---

## 七、笔记模块

### 7.1 创建笔记

```http
POST /api/notes
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "book_id": 1,
  "chapter_id": 1,
  "content": "这一段描写非常细腻，体现了主人公的坚韧。",
  "selected_text": "那天，再出去散步是不可能了",
  "is_public": 0
}
```

### 7.2 获取笔记列表

```http
GET /api/notes?book_id=1&page=1&size=20
Authorization: Bearer {token}
```

---

## 八、商城与订单模块

### 8.1 获取购物车

```http
GET /api/cart
Authorization: Bearer {token}
```

### 8.2 加入购物车

```http
POST /api/cart
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "book_id": 1,
  "quantity": 1
}
```

### 8.3 更新购物车

```http
PUT /api/cart/{cart_id}
Authorization: Bearer {token}
```

### 8.4 获取用户优惠券

```http
GET /api/coupons
Authorization: Bearer {token}
```

### 8.5 创建订单

```http
POST /api/orders
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "cart_item_ids": [1, 2, 3],
  "coupon_id": 1,
  "address_id": 1
}
```

### 8.6 订单支付

```http
POST /api/orders/{order_id}/pay
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "pay_method": "wechat",
  "pay_password": "123456"
}
```

### 8.7 获取订单列表

```http
GET /api/orders?page=1&size=10&status=1
Authorization: Bearer {token}
```

---

## 九、论坛模块

### 9.1 获取帖子列表

```http
GET /api/posts?page=1&size=20&topic_tag=阅读打卡
```

### 9.2 发布帖子

```http
POST /api/posts
Authorization: Bearer {token}
```

### 9.3 获取帖子详情

```http
GET /api/posts/{post_id}
```

### 9.4 发表评论

```http
POST /api/posts/{post_id}/comments
Authorization: Bearer {token}
```

---

## 十、阅读统计模块

### 10.1 获取阅读统计

```http
GET /api/reading/statistics
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total_duration": 36000,
    "total_books": 12,
    "total_notes": 28,
    "current_streak": 7,
    "daily_records": [
      { "date": "2023-12-01", "duration": 1800 },
      { "date": "2023-12-02", "duration": 2400 }
    ]
  }
}
```

---

## 十一、接口汇总表

| 模块 | 接口                               | 方法   | 说明             | 对应 APP 页面         |
| ---- | ---------------------------------- | ------ | ---------------- | --------------------- |
| 用户 | `/api/users/register`            | POST   | 用户注册         | 注册页                |
| 用户 | `/api/users/login`               | POST   | 用户登录         | 登录页                |
| 用户 | `/api/users/profile`             | GET    | 获取用户信息     | 我的页 / 个人资料页   |
| 用户 | `/api/users/profile`             | PUT    | 更新用户信息     | 编辑资料页            |
| 图书 | `/api/categories`                | GET    | 获取分类列表     | 书城首页              |
| 图书 | `/api/books`                     | GET    | 获取图书列表     | 书城首页 / 分类页     |
| 图书 | `/api/books/{id}`                | GET    | 获取图书详情     | 图书详情页            |
| 阅读 | `/api/books/{id}/chapters/{cid}` | GET    | 获取章节内容     | 阅读页 / 听书页       |
| 阅读 | `/api/reading/progress`          | POST   | 保存阅读进度     | 阅读页                |
| 阅读 | `/api/reading/records`           | POST   | 记录阅读时长     | 阅读页                |
| 书架 | `/api/bookshelf`                 | GET    | 我的书架         | 书架页                |
| 书架 | `/api/bookshelf`                 | POST   | 加入书架         | 图书详情页            |
| 书架 | `/api/bookshelf/{book_id}`       | DELETE | 移出书架         | 书架页                |
| 笔记 | `/api/notes`                     | GET    | 笔记列表         | 笔记页 / 我的笔记     |
| 笔记 | `/api/notes`                     | POST   | 创建笔记         | 阅读页                |
| 商城 | `/api/cart`                      | GET    | 购物车           | 购物车页              |
| 商城 | `/api/cart`                      | POST   | 加入购物车       | 图书详情页            |
| 商城 | `/api/cart/{cart_id}`            | PUT    | 更新购物车       | 购物车页              |
| 商城 | `/api/coupons`                   | GET    | 我的优惠券       | 结算页 / 我的券       |
| 订单 | `/api/orders`                    | POST   | 创建订单         | 结算页                |
| 订单 | `/api/orders/{id}/pay`           | POST   | 订单支付         | 支付页                |
| 订单 | `/api/orders`                    | GET    | 订单列表         | 订单页                |
| 论坛 | `/api/posts`                     | GET    | 帖子列表         | 论坛首页              |
| 论坛 | `/api/posts`                     | POST   | 发布帖子         | 发帖页                |
| 论坛 | `/api/posts/{id}`                | GET    | 帖子详情         | 帖子详情页            |
| 论坛 | `/api/posts/{id}/comments`       | POST   | 发表评论         | 帖子详情页            |
| 统计 | `/api/reading/statistics`        | GET    | 阅读统计         | 我的页                |

---

## 十二、安全与性能建议

1. **接口鉴权**：除登录、注册、图书列表等公开接口外，均需校验 JWT Token；
2. **参数校验**：对 `page`、`size` 做范围限制，防止分页参数过大；
3. **限流防刷**：对登录、注册、支付接口做限流处理；
4. **敏感数据**：密码必须使用 BCrypt 等加密算法，禁止明文传输；
5. **接口缓存**：图书详情、分类列表等读多写少的数据可接入 Redis 缓存；
6. **错误兜底**：统一异常处理，避免堆栈信息泄露到前端。

---

*最后更新：2026-07-02*
