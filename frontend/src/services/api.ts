import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('celebratelk.accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('celebratelk.accessToken')
      localStorage.removeItem('celebratelk.user')
    }
    return Promise.reject(error)
  },
)
