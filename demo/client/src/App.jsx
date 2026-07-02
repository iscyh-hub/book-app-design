import React from 'react'
import { useLocation } from 'react-router-dom'
import AppRouter from './router.jsx'
import BottomNav from './components/BottomNav.jsx'

function App() {
  const location = useLocation()
  const noNavPaths = ['/login', '/register', '/reader']
  const showNav = !noNavPaths.some((p) => location.pathname.startsWith(p))

  return (
    <div className="app">
      <div className="app-content" style={{ paddingBottom: showNav ? 56 : 0 }}>
        <AppRouter />
      </div>
      {showNav && <BottomNav />}
    </div>
  )
}

export default App
