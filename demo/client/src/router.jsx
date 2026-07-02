import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import BookDetail from './pages/BookDetail.jsx'
import Reader from './pages/Reader.jsx'
import Bookshelf from './pages/Bookshelf.jsx'
import Forum from './pages/Forum.jsx'
import Profile from './pages/Profile.jsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path="/reader/:bookId/:chapterId" element={<Reader />} />
      <Route path="/bookshelf" element={<Bookshelf />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
