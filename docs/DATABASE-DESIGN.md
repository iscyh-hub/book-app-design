# 汇读 · 智能阅读服务系统 —— 数据库设计文档

> 本文档为「汇读」APP 的后端数据存储方案，采用 MySQL 8.0 关系型数据库设计，覆盖用户、图书、阅读、订单、论坛等核心业务实体。

---

## 一、设计原则

1. **第三范式为主**：减少数据冗余，保证一致性；
2. **核心字段索引化**：`user_id`、`book_id`、`order_id` 等高频查询字段建立索引；
3. **软删除优先**：使用 `status` 或 `is_deleted` 字段替代物理删除，便于审计与恢复；
4. **时间戳统一**：每张表均包含 `created_at`、`updated_at`；
5. **业务状态枚举**：使用 `TINYINT` 表示状态，配合注释说明。

---

## 二、实体关系（ER 图）

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  categories │       │    books    │
│  (用户表)    │       │  (分类表)   │       │  (图书表)   │
└──────┬──────┘       └──────┬──────┘       └──────┬──────┘
       │                     │                     │
       │    ┌────────────────┘                     │
       │    │                                      │
       │    ▼                                      ▼
       │ ┌─────────────┐                    ┌─────────────┐
       │ │  bookshelf  │                    │  chapters   │
       │ │ (用户书架)  │                    │  (章节表)   │
       │ └──────┬──────┘                    └──────┬──────┘
       │        │                                  │
       │        ▼                                  ▼
       │   ┌─────────────┐                   ┌─────────────┐
       └──▶│    notes    │◀──────────────────│reading_records│
           │  (笔记表)   │                   │ (阅读记录表) │
           └─────────────┘                   └─────────────┘
       │
       │    ┌─────────────┐       ┌─────────────┐
       └───▶│    orders   │◀──────│ order_items │
              │  (订单表)   │       │ (订单明细表) │
              └──────┬──────┘       └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │ shopping_cart│
              │  (购物车表)  │
              └─────────────┘
       │
       │    ┌─────────────┐       ┌─────────────┐
       └───▶│    posts    │◀──────│  comments   │
              │  (帖子表)   │       │  (评论表)   │
              └─────────────┘       └─────────────┘
```

> 说明：上图展示核心实体关系，实际 ER 图见 `docs/er-diagram.png`（可用 dbdiagram.io / MySQL Workbench 生成）。

---

## 三、数据表详细设计

### 3.1 用户表 `users`

| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | INT PK AUTO_INCREMENT | 用户唯一 ID |
| `username` | VARCHAR(50) UNIQUE NOT NULL | 用户名 |
| `password` | VARCHAR(255) NOT NULL | 加密密码（BCrypt） |
| `nickname` | VARCHAR(50) | 昵称 |
| `avatar` | VARCHAR(255) | 头像 URL |
| `email` | VARCHAR(100) | 邮箱 |
| `phone` | VARCHAR(20) | 手机号 |
| `is_vip` | TINYINT DEFAULT 0 | 是否 VIP：0 否，1 是 |
| `vip_expire_date` | DATETIME | VIP 到期时间 |
| `status` | TINYINT DEFAULT 1 | 状态：0 禁用，1 正常 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '加密密码',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    is_vip TINYINT DEFAULT 0 COMMENT '是否VIP: 0否 1是',
    vip_expire_date DATETIME COMMENT 'VIP到期时间',
    status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

---

### 3.2 图书分类表 `categories`

| 字段 | 类型 | 说明 |
|------|------|------|
| `category_id` | INT PK AUTO_INCREMENT | 分类 ID |
| `parent_id` | INT DEFAULT 0 | 父分类 ID，0 为一级分类 |
| `name` | VARCHAR(50) NOT NULL | 分类名称 |
| `icon` | VARCHAR(255) | 分类图标 |
| `sort_order` | INT DEFAULT 0 | 排序 |
| `status` | TINYINT DEFAULT 1 | 状态：0 禁用，1 启用 |

```sql
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    parent_id INT DEFAULT 0 COMMENT '父分类ID, 0为一级分类',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(255) COMMENT '分类图标URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书分类表';
```

---

### 3.3 图书表 `books`

| 字段 | 类型 | 说明 |
|------|------|------|
| `book_id` | INT PK AUTO_INCREMENT | 图书 ID |
| `title` | VARCHAR(200) NOT NULL | 书名 |
| `author` | VARCHAR(100) | 作者 |
| `cover` | VARCHAR(255) | 封面 URL |
| `category_id` | INT | 分类 ID |
| `price` | DECIMAL(10,2) | 售价 |
| `original_price` | DECIMAL(10,2) | 原价 |
| `is_ebook` | TINYINT DEFAULT 1 | 是否有电子书：0 否，1 是 |
| `is_audiobook` | TINYINT DEFAULT 0 | 是否有声书：0 否，1 是 |
| `summary` | TEXT | 图书简介 |
| `publisher` | VARCHAR(100) | 出版社 |
| `isbn` | VARCHAR(20) | ISBN |
| `word_count` | INT | 字数 |
| `status` | TINYINT DEFAULT 1 | 状态：0 下架，1 上架 |
| `created_at` | TIMESTAMP | 创建时间 |

```sql
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '图书ID',
    title VARCHAR(200) NOT NULL COMMENT '书名',
    author VARCHAR(100) COMMENT '作者',
    cover VARCHAR(255) COMMENT '封面URL',
    category_id INT COMMENT '分类ID',
    price DECIMAL(10,2) COMMENT '售价',
    original_price DECIMAL(10,2) COMMENT '原价',
    is_ebook TINYINT DEFAULT 1 COMMENT '是否有电子书: 0否 1是',
    is_audiobook TINYINT DEFAULT 0 COMMENT '是否有声书: 0否 1是',
    summary TEXT COMMENT '图书简介',
    publisher VARCHAR(100) COMMENT '出版社',
    isbn VARCHAR(20) COMMENT 'ISBN',
    word_count INT COMMENT '字数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0下架 1上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    FULLTEXT INDEX idx_title_summary (title, summary) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书表';
```

---

### 3.4 章节表 `chapters`

| 字段 | 类型 | 说明 |
|------|------|------|
| `chapter_id` | INT PK AUTO_INCREMENT | 章节 ID |
| `book_id` | INT | 所属图书 ID |
| `chapter_no` | INT | 章节序号 |
| `title` | VARCHAR(200) | 章节标题 |
| `content` | LONGTEXT | 章节内容（电子书） |
| `audio_url` | VARCHAR(255) | 音频 URL（有声书） |
| `is_free` | TINYINT DEFAULT 1 | 是否免费：0 付费，1 免费 |
| `created_at` | TIMESTAMP | 创建时间 |

```sql
CREATE TABLE chapters (
    chapter_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '章节ID',
    book_id INT NOT NULL COMMENT '所属图书ID',
    chapter_no INT NOT NULL COMMENT '章节序号',
    title VARCHAR(200) COMMENT '章节标题',
    content LONGTEXT COMMENT '章节文本内容',
    audio_url VARCHAR(255) COMMENT '音频URL',
    is_free TINYINT DEFAULT 1 COMMENT '是否免费: 0付费 1免费',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_book_chapter (book_id, chapter_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='章节表';
```

---

### 3.5 用户书架表 `bookshelf`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT PK AUTO_INCREMENT | 主键 |
| `user_id` | INT | 用户 ID |
| `book_id` | INT | 图书 ID |
| `progress` | INT DEFAULT 0 | 阅读进度百分比 |
| `last_chapter_id` | INT | 上次阅读章节 ID |
| `last_read_position` | INT DEFAULT 0 | 上次阅读位置（字符偏移） |
| `is_favorite` | TINYINT DEFAULT 0 | 是否收藏：0 否，1 是 |
| `updated_at` | TIMESTAMP | 更新时间 |

```sql
CREATE TABLE bookshelf (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    user_id INT NOT NULL COMMENT '用户ID',
    book_id INT NOT NULL COMMENT '图书ID',
    progress INT DEFAULT 0 COMMENT '阅读进度百分比',
    last_chapter_id INT COMMENT '上次阅读章节ID',
    last_read_position INT DEFAULT 0 COMMENT '上次阅读位置',
    is_favorite TINYINT DEFAULT 0 COMMENT '是否收藏: 0否 1是',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user_book (user_id, book_id),
    INDEX idx_user_updated (user_id, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户书架表';
```

---

### 3.6 阅读笔记表 `notes`

| 字段 | 类型 | 说明 |
|------|------|------|
| `note_id` | INT PK AUTO_INCREMENT | 笔记 ID |
| `user_id` | INT | 用户 ID |
| `book_id` | INT | 图书 ID |
| `chapter_id` | INT | 章节 ID |
| `content` | TEXT | 笔记内容 |
| `selected_text` | VARCHAR(500) | 划选的原文 |
| `is_public` | TINYINT DEFAULT 0 | 是否公开：0 私密，1 公开 |
| `created_at` | TIMESTAMP | 创建时间 |

```sql
CREATE TABLE notes (
    note_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '笔记ID',
    user_id INT NOT NULL COMMENT '用户ID',
    book_id INT NOT NULL COMMENT '图书ID',
    chapter_id INT COMMENT '章节ID',
    content TEXT COMMENT '笔记内容',
    selected_text VARCHAR(500) COMMENT '划选原文',
    is_public TINYINT DEFAULT 0 COMMENT '是否公开: 0私密 1公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_book (user_id, book_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='阅读笔记表';
```

---

### 3.7 阅读记录表 `reading_records`

| 字段 | 类型 | 说明 |
|------|------|------|
| `record_id` | BIGINT PK AUTO_INCREMENT | 记录 ID |
| `user_id` | INT | 用户 ID |
| `book_id` | INT | 图书 ID |
| `chapter_id` | INT | 章节 ID |
| `duration` | INT | 本次阅读时长（秒） |
| `read_date` | DATE | 阅读日期（用于日历统计） |
| `created_at` | TIMESTAMP | 创建时间 |

```sql
CREATE TABLE reading_records (
    record_id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    book_id INT NOT NULL COMMENT '图书ID',
    chapter_id INT COMMENT '章节ID',
    duration INT DEFAULT 0 COMMENT '阅读时长(秒)',
    read_date DATE NOT NULL COMMENT '阅读日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_date (user_id, read_date),
    INDEX idx_user_book (user_id, book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='阅读记录表';
```

---

### 3.8 优惠券表 `coupons`

| 字段 | 类型 | 说明 |
|------|------|------|
| `coupon_id` | INT PK AUTO_INCREMENT | 优惠券 ID |
| `name` | VARCHAR(100) | 优惠券名称 |
| `type` | TINYINT | 类型：1 满减，2 折扣 |
| `threshold` | DECIMAL(10,2) | 使用门槛金额 |
| `value` | DECIMAL(10,2) | 优惠金额/折扣 |
| `valid_start` | DATETIME | 有效期开始 |
| `valid_end` | DATETIME | 有效期结束 |
| `total_count` | INT | 发放总数 |
| `status` | TINYINT DEFAULT 1 | 状态 |

```sql
CREATE TABLE coupons (
    coupon_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '优惠券ID',
    name VARCHAR(100) COMMENT '优惠券名称',
    type TINYINT NOT NULL COMMENT '类型: 1满减 2折扣',
    threshold DECIMAL(10,2) DEFAULT 0 COMMENT '使用门槛',
    value DECIMAL(10,2) NOT NULL COMMENT '优惠金额或折扣',
    valid_start DATETIME COMMENT '有效期开始',
    valid_end DATETIME COMMENT '有效期结束',
    total_count INT DEFAULT 0 COMMENT '发放总数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';
```

---

### 3.9 用户优惠券表 `user_coupons`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT PK AUTO_INCREMENT | 主键 |
| `user_id` | INT | 用户 ID |
| `coupon_id` | INT | 优惠券 ID |
| `status` | TINYINT DEFAULT 0 | 状态：0 未使用，1 已使用，2 已过期 |
| `used_order_id` | INT | 使用订单 ID |
| `valid_end` | DATETIME | 有效期结束 |
| `created_at` | TIMESTAMP | 领取时间 |

```sql
CREATE TABLE user_coupons (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    user_id INT NOT NULL COMMENT '用户ID',
    coupon_id INT NOT NULL COMMENT '优惠券ID',
    status TINYINT DEFAULT 0 COMMENT '状态: 0未使用 1已使用 2已过期',
    used_order_id INT COMMENT '使用订单ID',
    valid_end DATETIME COMMENT '有效期结束',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
    INDEX idx_user_status (user_id, status),
    INDEX idx_valid_end (valid_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券关联表';
```

---

### 3.10 订单表 `orders`

| 字段 | 类型 | 说明 |
|------|------|------|
| `order_id` | INT PK AUTO_INCREMENT | 订单 ID |
| `order_no` | VARCHAR(32) UNIQUE | 订单编号 |
| `user_id` | INT | 用户 ID |
| `total_amount` | DECIMAL(10,2) | 订单总金额 |
| `discount_amount` | DECIMAL(10,2) | 优惠金额 |
| `pay_amount` | DECIMAL(10,2) | 实付金额 |
| `coupon_id` | INT | 使用的优惠券 ID |
| `status` | TINYINT | 状态：0 待支付，1 已支付，2 已发货，3 已完成，4 已取消 |
| `pay_time` | DATETIME | 支付时间 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单编号',
    user_id INT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    discount_amount DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
    pay_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
    coupon_id INT COMMENT '使用优惠券ID',
    status TINYINT DEFAULT 0 COMMENT '状态: 0待支付 1已支付 2已发货 3已完成 4已取消',
    pay_time DATETIME COMMENT '支付时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_status (user_id, status),
    INDEX idx_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

---

### 3.11 订单明细表 `order_items`

| 字段 | 类型 | 说明 |
|------|------|------|
| `item_id` | INT PK AUTO_INCREMENT | 明细 ID |
| `order_id` | INT | 订单 ID |
| `book_id` | INT | 图书 ID |
| `book_title` | VARCHAR(200) | 图书标题（快照） |
| `book_cover` | VARCHAR(255) | 图书封面（快照） |
| `price` | DECIMAL(10,2) | 单价 |
| `quantity` | INT | 数量 |

```sql
CREATE TABLE order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '明细ID',
    order_id INT NOT NULL COMMENT '订单ID',
    book_id INT NOT NULL COMMENT '图书ID',
    book_title VARCHAR(200) COMMENT '图书标题快照',
    book_cover VARCHAR(255) COMMENT '图书封面快照',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT DEFAULT 1 COMMENT '数量',
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';
```

---

### 3.12 购物车表 `shopping_cart`

| 字段 | 类型 | 说明 |
|------|------|------|
| `cart_id` | INT PK AUTO_INCREMENT | 主键 |
| `user_id` | INT | 用户 ID |
| `book_id` | INT | 图书 ID |
| `quantity` | INT DEFAULT 1 | 数量 |
| `is_selected` | TINYINT DEFAULT 1 | 是否选中：0 否，1 是 |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

```sql
CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    user_id INT NOT NULL COMMENT '用户ID',
    book_id INT NOT NULL COMMENT '图书ID',
    quantity INT DEFAULT 1 COMMENT '数量',
    is_selected TINYINT DEFAULT 1 COMMENT '是否选中: 0否 1是',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user_book (user_id, book_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';
```

---

### 3.13 论坛帖子表 `posts`

| 字段 | 类型 | 说明 |
|------|------|------|
| `post_id` | INT PK AUTO_INCREMENT | 帖子 ID |
| `user_id` | INT | 发布用户 ID |
| `book_id` | INT | 关联图书 ID（可选） |
| `title` | VARCHAR(200) | 标题 |
| `content` | TEXT | 内容 |
| `cover` | VARCHAR(255) | 封面图 |
| `topic_tag` | VARCHAR(50) | 话题标签 |
| `like_count` | INT DEFAULT 0 | 点赞数 |
| `comment_count` | INT DEFAULT 0 | 评论数 |
| `is_top` | TINYINT DEFAULT 0 | 是否置顶 |
| `status` | TINYINT DEFAULT 1 | 状态：0 禁用，1 正常 |
| `created_at` | TIMESTAMP | 创建时间 |

```sql
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '帖子ID',
    user_id INT NOT NULL COMMENT '发布用户ID',
    book_id INT COMMENT '关联图书ID',
    title VARCHAR(200) COMMENT '标题',
    content TEXT COMMENT '内容',
    cover VARCHAR(255) COMMENT '封面图URL',
    topic_tag VARCHAR(50) COMMENT '话题标签',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    is_top TINYINT DEFAULT 0 COMMENT '是否置顶: 0否 1是',
    status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user (user_id),
    INDEX idx_topic (topic_tag),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='论坛帖子表';
```

---

### 3.14 评论表 `comments`

| 字段 | 类型 | 说明 |
|------|------|------|
| `comment_id` | INT PK AUTO_INCREMENT | 评论 ID |
| `post_id` | INT | 所属帖子 ID |
| `user_id` | INT | 评论用户 ID |
| `parent_id` | INT DEFAULT 0 | 父评论 ID，0 为一级评论 |
| `content` | TEXT | 评论内容 |
| `like_count` | INT DEFAULT 0 | 点赞数 |
| `status` | TINYINT DEFAULT 1 | 状态 |
| `created_at` | TIMESTAMP | 创建时间 |

```sql
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
    post_id INT NOT NULL COMMENT '所属帖子ID',
    user_id INT NOT NULL COMMENT '评论用户ID',
    parent_id INT DEFAULT 0 COMMENT '父评论ID, 0为一级评论',
    content TEXT COMMENT '评论内容',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_post (post_id),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';
```

---

## 四、关键查询示例

### 4.1 查询用户书架

```sql
SELECT b.book_id, b.title, b.cover, b.author, bs.progress, bs.updated_at
FROM bookshelf bs
JOIN books b ON bs.book_id = b.book_id
WHERE bs.user_id = 1 AND bs.is_favorite = 1
ORDER BY bs.updated_at DESC;
```

### 4.2 统计用户阅读时长（按天）

```sql
SELECT read_date, SUM(duration) AS total_duration
FROM reading_records
WHERE user_id = 1 AND read_date BETWEEN '2023-12-01' AND '2023-12-31'
GROUP BY read_date
ORDER BY read_date;
```

### 4.3 查询订单及明细

```sql
SELECT o.order_id, o.order_no, o.total_amount, o.pay_amount, o.status,
       oi.book_id, oi.book_title, oi.price, oi.quantity
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.user_id = 1
ORDER BY o.created_at DESC;
```

---

## 五、扩展建议

1. **读写分离**：查询量大的图书、章节内容可做只读副本；
2. **缓存层**：使用 Redis 缓存热门图书、用户阅读进度、购物车；
3. **全文搜索**：图书搜索可用 Elasticsearch 替代 MySQL LIKE；
4. **分表分库**：阅读记录表 `reading_records` 增长快，可按 `user_id` 分表；
5. **审计日志**：对订单状态变更、用户登录增加操作日志表。

---

*最后更新：2026-07-02*
