import request from './request.js'

export const getCategories = () => request.get('/api/categories')
export const getBooks = (params) => request.get('/api/books', { params })
export const getBookDetail = (id) => request.get(`/api/books/${id}`)
export const getChapter = (bookId, chapterId) => request.get(`/api/books/${bookId}/chapters/${chapterId}`)
