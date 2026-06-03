import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { Role, User } from '../../types/domain'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('celebratelk.user') ?? 'null'),
  token: localStorage.getItem('celebratelk.accessToken'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string; role?: Role }) => {
    try {
      const { data } = await api.post('/auth/login', payload)
      return data.data as { user: User; token: string }
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Login failed'
      throw new Error(message, { cause: error })
    }
  },
)

export const loadCurrentUser = createAsyncThunk('auth/me', async () => {
  const { data } = await api.get('/auth/me')
  return data.data as { user: User }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('celebratelk.user')
      localStorage.removeItem('celebratelk.accessToken')
      void api.post('/auth/logout').catch(() => undefined)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        localStorage.setItem('celebratelk.user', JSON.stringify(action.payload.user))
        localStorage.setItem('celebratelk.accessToken', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Login failed'
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        localStorage.setItem('celebratelk.user', JSON.stringify(action.payload.user))
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null
        state.token = null
        localStorage.removeItem('celebratelk.user')
        localStorage.removeItem('celebratelk.accessToken')
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
