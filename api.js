import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export const getProducts = () => api.get('/products').then(r => r.data)
export const getSummary  = () => api.get('/summary').then(r => r.data)
export const getTrends   = () => api.get('/trends').then(r => r.data)
export const sendChat    = (question) =>
  api.post('/chat', { question }).then(r => r.data)

export default api
