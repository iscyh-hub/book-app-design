import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { NavBar, Grid, Image, InfiniteScroll, PullToRefresh } from 'antd-mobile'
import { getBooks } from '../api/books.js'

export default function Category() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || '分类'

  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setBooks([])
    setPage(1)
    setHasMore(true)
    loadBooks(1, true)
  }, [id])

  const loadBooks = async (p = page, reset = false) => {
    const res = await getBooks({ category_id: id, page: p, size: 20 })
    const list = res.data.list
    setBooks((prev) => (reset ? list : [...prev, ...list]))
    setHasMore(list.length === 20)
    if (reset) setPage(2)
    else setPage((prev) => prev + 1)
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar onBack={() => navigate(-1)}>{name}</NavBar>
      <PullToRefresh onRefresh={() => loadBooks(1, true)}>
        <Grid columns={2} gap={12} style={{ padding: 12 }}>
          {books.map((book) => (
            <Grid.Item key={book.book_id} onClick={() => navigate(`/book/${book.book_id}`)}>
              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                <Image src={book.cover} style={{ width: '100%', aspectRatio: '3/4' }} fit="cover" />
                <div style={{ padding: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{book.title}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{book.author}</div>
                  <div style={{ fontSize: 13, color: '#ff4d4f', marginTop: 4 }}>¥{book.price}</div>
                </div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </PullToRefresh>
      <InfiniteScroll loadMore={() => loadBooks()} hasMore={hasMore} />
    </div>
  )
}
