import React from 'react'
import { NavBar, Empty } from 'antd-mobile'

export default function Forum() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar>论坛</NavBar>
      <Empty description="论坛模块暂未实现，敬请期待" style={{ marginTop: 120 }} />
    </div>
  )
}
