CREATE DATABASE IF NOT EXISTS huidu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE huidu;

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    parent_id INT DEFAULT 0 COMMENT '父分类ID, 0为一级分类',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(255) COMMENT '分类图标URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书分类表';

CREATE TABLE IF NOT EXISTS books (
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

CREATE TABLE IF NOT EXISTS chapters (
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

CREATE TABLE IF NOT EXISTS bookshelf (
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

CREATE TABLE IF NOT EXISTS notes (
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

CREATE TABLE IF NOT EXISTS reading_records (
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

CREATE TABLE IF NOT EXISTS coupons (
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

CREATE TABLE IF NOT EXISTS user_coupons (
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

CREATE TABLE IF NOT EXISTS orders (
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

CREATE TABLE IF NOT EXISTS order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '明细ID',
    order_id INT NOT NULL COMMENT '订单ID',
    book_id INT NOT NULL COMMENT '图书ID',
    book_title VARCHAR(200) COMMENT '图书标题快照',
    book_cover VARCHAR(255) COMMENT '图书封面快照',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT DEFAULT 1 COMMENT '数量',
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

CREATE TABLE IF NOT EXISTS shopping_cart (
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

CREATE TABLE IF NOT EXISTS posts (
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

CREATE TABLE IF NOT EXISTS comments (
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
