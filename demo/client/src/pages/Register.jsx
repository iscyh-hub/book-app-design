import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, NavBar, Toast } from 'antd-mobile'
import { register } from '../api/auth.js'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await register(values)
      Toast.show({ content: '注册成功，请登录', position: 'bottom' })
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <NavBar onBack={() => navigate(-1)}>注册</NavBar>
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 32 }}>注册汇读账号</h1>
        <Form
          layout="horizontal"
          mode="card"
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" size="large" loading={loading}>
              注册
            </Button>
          }
        >
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="用户名" clearable />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input placeholder="密码" type="password" clearable />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="昵称（可选）" clearable />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, textAlign: 'center', color: '#666' }}>
          已有账号？
          <span style={{ color: '#1677ff' }} onClick={() => navigate('/login')}>去登录</span>
        </div>
      </div>
    </div>
  )
}
