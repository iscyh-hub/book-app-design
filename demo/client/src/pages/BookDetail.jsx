import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavBar, Button, List, Image, Toast, Modal } from 'antd-mobile'
import { getBookDetail } from '../api/books.js'
import { addToBookshelf } from '../api/bookshelf.js'
import { isLoggedIn } from '../utils/token.js'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)

  useEffect(() => {
    loadBook()
  }, [id])

  const loadBook = async () => {
    const res = await getBookDetail(id)
    setBook(res.data)
  }

  const handleAddBookshelf = async () => {
    if (!isLoggedIn()) {
      Modal.confirm({
        content: '登录后可加入书架，是否去登录？',
        onConfirm: () => navigate('/login'),
      })
      return
    }
    await addToBookshelf({ book_id: id, is_favorite: 1 })
    Toast.show({ content: '已加入书架', position: 'bottom' })
  }

  const startReading = () => {
    if (!book?.chapters?.length) return
    navigate(`/reader/${id}/${book.chapters[0].chapter_id}`)
  }

  if (!book) return null

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: 80 }}>
      <NavBar onBack={() => navigate(-1)}>图书详情</NavBar>

      <div style={{ background: '#fff', padding: 16, display: 'flex', gap: 16 }}>
        <Image src={book.cover} style={{ width: 120, borderRadius: 8, flexShrink: 0 }} fit="cover" />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>{book.title}</h2>
          <p style={{ color: '#666', margin: '8px 0' }}>{book.author}</p>
          <p style={{ color: '#ff4d4f', fontSize: 18, margin: '8px 0' }}>¥{book.price}</p>
          <p style={{ color: '#999', fontSize: 12 }}>{book.word_count} 字 · {book.is_ebook ? '电子书' : ''} {book.is_audiobook ? '· 有声书' : ''}</p>
        </div>
      </div>

      <div style={{ marginTop: 12, background: '#fff', padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>简介</h3>
        <p style={{ color: '#555', lineHeight: 1.6, margin: 0 }}>{book.summary}</p>
      </div>

      <div style={{ marginTop: 12, background: '#fff' }}>
        <List header="章节目录">
          {book.chapters?.map((chapter) => (
            <List.Item
              key={chapter.chapter_id}
              onClick={() => navigate(`/reader/${id}/${chapter.chapter_id}`)}
              arrow
            >
              {chapter.title}
            </List.Item>
          ))}
        </List>
      </div>

      <div className="book-detail-actions">
        <Button block color="default" onClick={handleAddBookshelf}>加入书架</Button>
        <Button block color="primary" onClick={startReading}>开始阅读</Button>
      </div>
    </div>
  )
}
