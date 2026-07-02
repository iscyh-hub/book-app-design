import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { AppOutline, AppstoreOutline, MessageOutline, UserOutline } from 'antd-mobile-icons'

const tabs = [
  { key: '/', title: '书城', icon: <AppOutline /> },
  { key: '/bookshelf', title: '书架', icon: <AppstoreOutline /> },
  { key: '/forum', title: '论坛', icon: <MessageOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <TabBar
      className="bottom-nav"
      activeKey={location.pathname}
      onChange={(key) => navigate(key)}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
