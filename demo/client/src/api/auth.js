import request from './request.js'

export const register = (data) => request.post('/api/users/register', data)
export const login = (data) => request.post('/api/users/login', data)
export const getProfile = () => request.get('/api/users/profile')
export const updateProfile = (data) => request.put('/api/users/profile', data)
