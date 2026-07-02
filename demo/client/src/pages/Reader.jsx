import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavBar, Popup, Button, Slider, Space, Toast } from 'antd-mobile'
import { UnorderedListOutline, LeftOutline, RightOutline } from 'antd-mobile-icons'
import { getBookDetail, getChapter } from '../api/books.js'
import { saveProgress } from '../api/bookshelf.js'

const FONT_SIZES = [16, 18, 20, 22, 24]

export default function Reader() {
  const { bookId, chapterId } = useParams()
  const navigate = useNavigate()
  const contentRef = useRef(null)

  const [book, setBook] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(2)
  const [nightMode, setNightMode] = useState(false)

  const fontSize = FONT_SIZES[fontSizeIndex]

  useEffect(() => {
    loadBookAndChapter()
  }, [bookId, chapterId])

  const loadBookAndChapter = async () => {
    const [bookRes, chapterRes] = await Promise.all([
      getBookDetail(bookId),
      getChapter(bookId, chapterId),
    ])
    setBook(bookRes.data)
    setChapters(bookRes.data.chapters || [])
    setChapter(chapterRes.data)
    // 回到顶部
    if (contentRef.current) contentRef.current.scrollTop = 0
  }

  const goChapter = (cid) => {
    setDrawerVisible(false)
    navigate(`/reader/${bookId}/${cid}`)
  }

  const saveCurrentProgress = () => {
    if (!chapter) return
    const position = contentRef.current?.scrollTop || 0
    saveProgress({
      book_id: bookId,
      chapter_id: chapterId,
      position,
      progress: 0,
    }).catch(() => {})
  }

  useEffect(() => {
    return () => {
      saveCurrentProgress()
    }
  }, [chapterId])

  const prevChapter = () => {
    if (chapter?.prev_chapter_id) {
      saveCurrentProgress()
      goChapter(chapter.prev_chapter_id)
    } else {
      Toast.show({ content: '已经是第一章了', position: 'bottom' })
    }
  }

  const nextChapter = () => {
    if (chapter?.next_chapter_id) {
      saveCurrentProgress()
      goChapter(chapter.next_chapter_id)
    } else {
      Toast.show({ content: '已经是最后一章了', position: 'bottom' })
    }
  }

  const bg = nightMode ? '#1a1a1a' : '#f7f5f0'
  const color = nightMode ? '#c7c7c7' : '#333'

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: bg, color }}>
      <NavBar
        onBack={() => {
          saveCurrentProgress()
          navigate(`/book/${bookId}`)
        }}
        right={
          <Space>
            <Button size="mini" color="default" onClick={() => setNightMode(!nightMode)}>
              {nightMode ? '日间' : '夜间'}
            </Button>
            <Button size="mini" color="default" onClick={() => setDrawerVisible(true)}>
              <UnorderedListOutline />
            </Button>
          </Space>
        }
      >
        {chapter?.title || '阅读中'}
      </NavBar>

      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          fontSize,
          lineHeight: 1.8,
          whiteSpace: 'pre-line',
        }}
      >
        <h2 style={{ fontSize: fontSize + 4, marginBottom: 16 }}>{chapter?.title}</h2>
        <div>{chapter?.content}</div>

        {chapter?.audio_url && (
          <audio controls src={chapter.audio_url} style={{ width: '100%', marginTop: 24 }} />
        )}
      </div>

      <div
        style={{
          padding: '8px 12px',
          borderTop: `1px solid ${nightMode ? '#333' : '#eee'}`,
          background: nightMode ? '#222' : '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Button size="small" color="default" onClick={prevChapter}>
          <LeftOutline /> 上一章
        </Button>
        <Slider
          style={{ flex: 1 }}
          min={0}
          max={FONT_SIZES.length - 1}
          step={1}
          value={fontSizeIndex}
          onChange={setFontSizeIndex}
          icon={null}
        />
        <Button size="small" color="default" onClick={nextChapter}>
          下一章 <RightOutline />
        </Button>
      </div>

      <Popup
        position='left'
        visible={drawerVisible}
        onMaskClick={() => setDrawerVisible(false)}
        bodyStyle={{ width: 280 }}
        getContainer={() => document.querySelector('.app')}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 600 }}>目录</div>
        <div style={{ padding: '0 12px' }}>
          {chapters.map((c) => (
            <div
              key={c.chapter_id}
              onClick={() => goChapter(c.chapter_id)}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #eee',
                color: String(c.chapter_id) === chapterId ? '#1677ff' : '#333',
                fontWeight: String(c.chapter_id) === chapterId ? 600 : 400,
              }}
            >
              {c.title}
            </div>
          ))}
        </div>
      </Popup>
    </div>
  )
}
