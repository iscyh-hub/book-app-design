import {
  mockGetBookshelf,
  mockAddToBookshelf,
  mockRemoveFromBookshelf,
  mockSaveProgress,
} from './mockData.js'

export const getBookshelf = () => mockGetBookshelf()
export const addToBookshelf = (data) => mockAddToBookshelf(data)
export const removeFromBookshelf = (bookId) => mockRemoveFromBookshelf(bookId)
export const saveProgress = (data) => mockSaveProgress(data)
