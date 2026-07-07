import {
  mockLogin,
  mockRegister,
  mockGetProfile,
  mockUpdateProfile,
} from './mockData.js'

export const register = (data) => mockRegister(data)
export const login = (data) => mockLogin(data)
export const getProfile = () => mockGetProfile()
export const updateProfile = (data) => mockUpdateProfile(data)
