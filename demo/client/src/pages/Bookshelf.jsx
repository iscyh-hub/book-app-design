import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, List, Image, Button, Empty, Toast } from 'antd-mobile'
import { getBookshelf, removeFromBookshelf } from '../api/bookshelf.js'
import { isLoggedIn } from '../utils/token.js'

export default function Bookshelf() {
  const navigate = useNavigate()
  const [list, setList] = useState([])

  useEffect(() => {
    if (!isLoggedIn()) return
    load()
  }, [])

  const load = async () => {
    try {
      const res = await getBookshelf()
      setList(res.data)
    } catch {
      Toast.show({ content: '加载失败', position: 'bottom' })
    }
  }

  const remove = async (bookId) => {
    await removeFromBookshelf(bookId)
    Toast.show({ content: '已移出书架', position: 'bottom' })
    load()
  }

  if (!isLoggedIn()) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <NavBar>书架</NavBar>
        <Empty description="登录后查看书架" style={{ marginTop: 120 }}>
          <Button color="primary" onClick={() => navigate('/login')}>去登录</Button>
        </Empty>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar>我的书架</NavBar>
      <List>
        {list.map((item) => (
          <List.Item
            key={item.id}
            prefix={
              <Image src={item.cover} style={{ width: 56, height: 74, borderRadius: 4 }} fit="cover" />
            }
            title={item.title}
            description={<div>{item.author} · 进度 {item.progress || 0}%</div>}
            arrow
            onClick={() =>
              navigate(`/reader/${item.book_id}/${item.last_chapter_id || 1}`)
            }
            extra={
              <Button size="mini" color="default" onClick={(e) => { e.stopPropagation(); remove(item.book_id) }}>
                移除
              </Button>
            }
          />
        ))}
      </List>
      {list.length === 0 && <Empty description="书架空空如也" style={{ marginTop: 120 }} />}
    </div>
  )
}
