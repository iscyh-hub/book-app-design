import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, NavBar, Toast } from 'antd-mobile'
import { login } from '../api/auth.js'
import { setToken } from '../utils/token.js'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await login(values)
      setToken(res.data.token)
      Toast.show({ content: '登录成功', position: 'bottom' })
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <NavBar onBack={() => navigate(-1)} backArrow={false}>登录</NavBar>
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 32 }}>欢迎回到汇读</h1>
        <Form
          layout="horizontal"
          mode="card"
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" size="large" loading={loading}>
              登录
            </Button>
          }
        >
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" clearable />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input placeholder="请输入密码" type="password" clearable />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, textAlign: 'center', color: '#666' }}>
          还没有账号？
          <span style={{ color: '#1677ff' }} onClick={() => navigate('/register')}>去注册</span>
        </div>
        <div style={{ marginTop: 24, padding: 12, background: '#f5f5f5', borderRadius: 8, color: '#888', fontSize: 12 }}>
          测试账号：test / 123456
        </div>
      </div>
    </div>
  )
}
