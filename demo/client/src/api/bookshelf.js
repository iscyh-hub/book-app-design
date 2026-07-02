import request from './request.js'

export const getBookshelf = () => request.get('/api/bookshelf')
export const addToBookshelf = (data) => request.post('/api/bookshelf', data)
export const removeFromBookshelf = (bookId) => request.delete(`/api/bookshelf/${bookId}`)
export const saveProgress = (data) => request.post('/api/reading/progress', data)
