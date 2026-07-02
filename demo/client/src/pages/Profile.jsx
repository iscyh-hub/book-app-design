import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, List, Avatar, Button, Toast } from 'antd-mobile'
import { getProfile } from '../api/auth.js'
import { removeToken, isLoggedIn } from '../utils/token.js'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (isLoggedIn()) {
      getProfile().then((res) => setUser(res.data)).catch(() => {})
    }
  }, [])

  const logout = () => {
    removeToken()
    Toast.show({ content: '已退出登录', position: 'bottom' })
    setUser(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar>我的</NavBar>

      <div style={{ background: '#fff', padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar src={user?.avatar} style={{ '--size': '64px' }} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{user?.nickname || user?.username || '未登录'}</div>
          <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{user ? (user.is_vip ? 'VIP 会员' : '普通用户') : '登录后享受完整功能'}</div>
        </div>
      </div>

      <List style={{ marginTop: 12 }}>
        <List.Item arrow onClick={() => Toast.show({ content: '功能开发中', position: 'bottom' })}>
          阅读统计
        </List.Item>
        <List.Item arrow onClick={() => Toast.show({ content: '功能开发中', position: 'bottom' })}>
          我的笔记
        </List.Item>
        <List.Item arrow onClick={() => Toast.show({ content: '功能开发中', position: 'bottom' })}>
          我的订单
        </List.Item>
      </List>

      <div style={{ padding: 24 }}>
        {user ? (
          <Button block color="danger" onClick={logout}>退出登录</Button>
        ) : (
          <Button block color="primary" onClick={() => navigate('/login')}>登录 / 注册</Button>
        )}
      </div>
    </div>
  )
}
