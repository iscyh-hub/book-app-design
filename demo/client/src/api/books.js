import {
  mockGetCategories,
  mockGetBooks,
  mockGetBookDetail,
  mockGetChapter,
} from './mockData.js'

export const getCategories = () => mockGetCategories()
export const getBooks = (params) => mockGetBooks(params)
export const getBookDetail = (id) => mockGetBookDetail(id)
export const getChapter = (bookId, chapterId) => mockGetChapter(bookId, chapterId)
