export const setToken = (token) => localStorage.setItem('huidu_token', token)
export const getToken = () => localStorage.getItem('huidu_token')
export const removeToken = () => localStorage.removeItem('huidu_token')
export const isLoggedIn = () => !!getToken()
