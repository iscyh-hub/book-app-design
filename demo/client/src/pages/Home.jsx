import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar, Grid, List, Image, NavBar, Toast } from 'antd-mobile'
import { getCategories, getBooks } from '../api/books.js'

export default function Home() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [books, setBooks] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
    loadBooks()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data)
    } catch {
      Toast.show({ content: '分类加载失败', position: 'bottom' })
    }
  }

  const loadBooks = async (search = '') => {
    setLoading(true)
    try {
      const res = await getBooks({ page: 1, size: 20, keyword: search })
      setBooks(res.data.list)
    } finally {
      setLoading(false)
    }
  }

  const onSearch = (val) => {
    setKeyword(val)
    loadBooks(val)
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar back={null}>汇读书城</NavBar>

      <div style={{ padding: '8px 12px', background: '#fff' }}>
        <SearchBar
          placeholder="搜索书名 / 作者"
          value={keyword}
          onChange={setKeyword}
          onSearch={onSearch}
          onClear={() => onSearch('')}
        />
      </div>

      <div style={{ background: '#fff', padding: '12px 0' }}>
        <Grid columns={5} gap={8} style={{ padding: '0 12px' }}>
          {categories.map((cat) => (
            <Grid.Item
              key={cat.category_id}
              onClick={() => navigate(`/category/${cat.category_id}`, { state: { name: cat.name } })}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  src={cat.icon}
                  width={40}
                  height={40}
                  fit="cover"
                  style={{ borderRadius: 8 }}
                  fallback={<div style={{ width: 40, height: 40, background: '#eee', borderRadius: 8 }} />}
                />
                <div style={{ fontSize: 12, marginTop: 4 }}>{cat.name}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      <div style={{ marginTop: 12, background: '#fff', padding: '12px' }}>
        <h3 style={{ margin: '0 0 12px' }}>热门推荐</h3>
        <Grid columns={2} gap={12}>
          {books.map((book) => (
            <Grid.Item key={book.book_id} onClick={() => navigate(`/book/${book.book_id}`)}>
              <div style={{ background: '#fafafa', borderRadius: 8, overflow: 'hidden' }}>
                <Image
                  src={book.cover}
                  style={{ width: '100%', aspectRatio: '3/4' }}
                  fit="cover"
                  fallback={<div style={{ width: '100%', aspectRatio: '3/4', background: '#eee' }} />}
                />
                <div style={{ padding: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{book.title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{book.author}</div>
                  <div style={{ fontSize: 13, color: '#ff4d4f', marginTop: 4 }}>¥{book.price}</div>
                </div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
        {books.length === 0 && !loading && (
          <List>
            <List.Item>暂无图书</List.Item>
          </List>
        )}
      </div>
    </div>
  )
}
