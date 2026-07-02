# 汇读 · 智能阅读服务系统 —— 接口设计文档

> 本文档定义「汇读」APP 与后端服务之间的 RESTful API 接口规范，覆盖用户、图书、阅读、书架、订单、论坛等核心模块。

---

## 一、接口设计规范

### 1.1 基础约定

| 项 | 约定 |
|----|------|
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 鉴权方式 | Bearer Token（JWT） |
| 请求头 | `Content-Type: application/json`、`Authorization: Bearer {token}` |
| 基础路径 | `https://api.huidu.example.com/v1` |

### 1.2 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段 | 说明 |
|------|------|
| `code` | 业务状态码，200 为成功 |
| `message` | 提示信息 |
| `data` | 响应数据 |

### 1.3 常见状态码

| HTTP 状态码 | 含义 |
|------------|------|
| 200 | 请求成功 |
| 400 | 参数错误 |
| 401 | 未登录或 Token 失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 二、用户模块

### 2.1 用户注册

```http
POST /api/users/register
```

**请求参数：**

```json
{
  "username": "reader001",
  "password": "123456",
  "nickname": "书友小王"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": 1,
    "username": "reader001",
    "nickname": "书友小王"
  }
}
```

### 2.2 用户登录

```http
POST /api/users/login
```

**请求参数：**

```json
{
  "username": "reader001",
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
    "nickname": "书友小王",
    "avatar": "https://cdn.example.com/avatar/1.jpg",
    "is_vip": 0,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2.3 获取用户信息

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
    "username": "reader001",
    "nickname": "书友小王",
    "avatar": "https://cdn.example.com/avatar/1.jpg",
    "email": "reader@example.com",
    "phone": "13800138000",
    "is_vip": 1,
    "vip_expire_date": "2024-12-31 23:59:59"
  }
}
```

### 2.4 更新用户信息

```http
PUT /api/users/profile
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "nickname": "书友小王",
  "avatar": "https://cdn.example.com/avatar/1.jpg",
  "email": "reader@example.com"
}
```

---

## 三、图书模块

### 3.1 获取图书分类

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

### 3.2 获取图书列表

```http
GET /api/books?page=1&size=20&category_id=1&keyword=简爱&sort=newest
```

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | int | 否 | 页码，默认 1 |
| `size` | int | 否 | 每页数量，默认 20 |
| `category_id` | int | 否 | 分类 ID |
| `keyword` | string | 否 | 搜索关键词 |
| `sort` | string | 否 | 排序：newest/hottest/best_selling |

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

### 3.3 获取图书详情

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

## 四、阅读模块

### 4.1 获取章节内容

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

### 4.2 保存阅读进度

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

**响应示例：**

```json
{
  "code": 200,
  "message": "进度保存成功",
  "data": null
}
```

### 4.3 记录阅读时长

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

**响应示例：**

```json
{
  "code": 200,
  "message": "记录成功",
  "data": null
}
```

---

## 五、书架模块

### 5.1 获取我的书架

```http
GET /api/bookshelf?page=1&size=20
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 12,
    "list": [
      {
        "book_id": 1,
        "title": "简爱",
        "cover": "https://cdn.example.com/covers/jianai.jpg",
        "author": "夏洛蒂·勃朗特",
        "progress": 35,
        "last_chapter_title": "第一章 盖茨黑德府",
        "is_favorite": 1,
        "updated_at": "2023-12-10 15:30:00"
      }
    ]
  }
}
```

### 5.2 加入书架

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

### 5.3 移出书架

```http
DELETE /api/bookshelf/{book_id}
Authorization: Bearer {token}
```

---

## 六、笔记模块

### 6.1 创建笔记

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

**响应示例：**

```json
{
  "code": 200,
  "message": "笔记创建成功",
  "data": {
    "note_id": 1,
    "created_at": "2023-12-10 16:00:00"
  }
}
```

### 6.2 获取笔记列表

```http
GET /api/notes?book_id=1&page=1&size=20
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 8,
    "list": [
      {
        "note_id": 1,
        "book_id": 1,
        "chapter_id": 1,
        "chapter_title": "第一章 盖茨黑德府",
        "content": "这一段描写非常细腻...",
        "selected_text": "那天，再出去散步是不可能了",
        "is_public": 0,
        "created_at": "2023-12-10 16:00:00"
      }
    ]
  }
}
```

---

## 七、商城与订单模块

### 7.1 获取购物车

```http
GET /api/cart
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 3,
    "total_amount": 89.70,
    "list": [
      {
        "cart_id": 1,
        "book_id": 1,
        "title": "简爱",
        "cover": "https://cdn.example.com/covers/jianai.jpg",
        "price": 19.90,
        "quantity": 1,
        "is_selected": 1
      }
    ]
  }
}
```

### 7.2 加入购物车

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

### 7.3 更新购物车选中状态

```http
PUT /api/cart/{cart_id}
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "quantity": 2,
  "is_selected": 1
}
```

### 7.4 获取用户优惠券

```http
GET /api/coupons
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "coupon_id": 1,
      "name": "满50减10",
      "type": 1,
      "threshold": 50.00,
      "value": 10.00,
      "valid_end": "2023-12-31 23:59:59"
    }
  ]
}
```

### 7.5 创建订单

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

**响应示例：**

```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "order_id": 10001,
    "order_no": "H20231210120001",
    "total_amount": 89.70,
    "discount_amount": 10.00,
    "pay_amount": 79.70,
    "status": 0
  }
}
```

### 7.6 订单支付

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

**响应示例：**

```json
{
  "code": 200,
  "message": "支付成功",
  "data": {
    "order_id": 10001,
    "status": 1,
    "pay_time": "2023-12-10 12:05:30"
  }
}
```

### 7.7 获取订单列表

```http
GET /api/orders?page=1&size=10&status=1
Authorization: Bearer {token}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "list": [
      {
        "order_id": 10001,
        "order_no": "H20231210120001",
        "total_amount": 89.70,
        "pay_amount": 79.70,
        "status": 1,
        "created_at": "2023-12-10 12:00:00",
        "items": [
          {
            "book_id": 1,
            "book_title": "简爱",
            "book_cover": "https://cdn.example.com/covers/jianai.jpg",
            "price": 19.90,
            "quantity": 1
          }
        ]
      }
    ]
  }
}
```

---

## 八、论坛模块

### 8.1 获取帖子列表

```http
GET /api/posts?page=1&size=20&topic_tag=阅读打卡
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 128,
    "list": [
      {
        "post_id": 1,
        "user_id": 2,
        "nickname": "阅读达人小李",
        "avatar": "https://cdn.example.com/avatar/2.jpg",
        "title": "读完《简爱》，谈谈我的感受",
        "cover": "https://cdn.example.com/post/1.jpg",
        "topic_tag": "读后感",
        "like_count": 56,
        "comment_count": 12,
        "is_top": 0,
        "created_at": "2023-12-09 10:00:00"
      }
    ]
  }
}
```

### 8.2 发布帖子

```http
POST /api/posts
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "book_id": 1,
  "title": "读完《简爱》，谈谈我的感受",
  "content": "这本书最让我感动的是...",
  "cover": "https://cdn.example.com/post/1.jpg",
  "topic_tag": "读后感"
}
```

### 8.3 获取帖子详情

```http
GET /api/posts/{post_id}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "post_id": 1,
    "user_id": 2,
    "nickname": "阅读达人小李",
    "title": "读完《简爱》，谈谈我的感受",
    "content": "这本书最让我感动的是...",
    "like_count": 56,
    "comment_count": 12,
    "created_at": "2023-12-09 10:00:00",
    "comments": [
      {
        "comment_id": 1,
        "user_id": 3,
        "nickname": "书友小王",
        "content": "同感，写得很好！",
        "like_count": 3,
        "created_at": "2023-12-09 11:00:00"
      }
    ]
  }
}
```

### 8.4 发表评论

```http
POST /api/posts/{post_id}/comments
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "parent_id": 0,
  "content": "同感，写得很好！"
}
```

---

## 九、阅读统计模块

### 9.1 获取阅读统计

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
      {
        "date": "2023-12-01",
        "duration": 1800
      },
      {
        "date": "2023-12-02",
        "duration": 2400
      }
    ]
  }
}
```

---

## 十、接口汇总表

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 用户 | `/api/users/register` | POST | 用户注册 |
| 用户 | `/api/users/login` | POST | 用户登录 |
| 用户 | `/api/users/profile` | GET | 获取用户信息 |
| 用户 | `/api/users/profile` | PUT | 更新用户信息 |
| 图书 | `/api/categories` | GET | 获取分类列表 |
| 图书 | `/api/books` | GET | 获取图书列表 |
| 图书 | `/api/books/{id}` | GET | 获取图书详情 |
| 阅读 | `/api/books/{id}/chapters/{cid}` | GET | 获取章节内容 |
| 阅读 | `/api/reading/progress` | POST | 保存阅读进度 |
| 阅读 | `/api/reading/records` | POST | 记录阅读时长 |
| 书架 | `/api/bookshelf` | GET | 我的书架 |
| 书架 | `/api/bookshelf` | POST | 加入书架 |
| 书架 | `/api/bookshelf/{book_id}` | DELETE | 移出书架 |
| 笔记 | `/api/notes` | GET | 笔记列表 |
| 笔记 | `/api/notes` | POST | 创建笔记 |
| 商城 | `/api/cart` | GET | 购物车 |
| 商城 | `/api/cart` | POST | 加入购物车 |
| 商城 | `/api/cart/{cart_id}` | PUT | 更新购物车 |
| 商城 | `/api/coupons` | GET | 我的优惠券 |
| 订单 | `/api/orders` | POST | 创建订单 |
| 订单 | `/api/orders/{id}/pay` | POST | 订单支付 |
| 订单 | `/api/orders` | GET | 订单列表 |
| 论坛 | `/api/posts` | GET | 帖子列表 |
| 论坛 | `/api/posts` | POST | 发布帖子 |
| 论坛 | `/api/posts/{id}` | GET | 帖子详情 |
| 论坛 | `/api/posts/{id}/comments` | POST | 发表评论 |
| 统计 | `/api/reading/statistics` | GET | 阅读统计 |

---

## 十一、安全与性能建议

1. **接口鉴权**：除登录、注册、图书列表等公开接口外，均需校验 JWT Token；
2. **参数校验**：对 `page`、`size` 做范围限制，防止分页参数过大；
3. **限流防刷**：对登录、注册、支付接口做限流处理；
4. **敏感数据**：密码必须使用 BCrypt 等加密算法，禁止明文传输；
5. **接口缓存**：图书详情、分类列表等读多写少的数据可接入 Redis 缓存；
6. **错误兜底**：统一异常处理，避免堆栈信息泄露到前端。

---

*最后更新：2026-07-02*
