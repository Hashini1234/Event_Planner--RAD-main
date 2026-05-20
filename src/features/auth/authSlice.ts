import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { Role, User } from '../../types/domain'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

const demoUser: User = {
  id: 'u-demo',
  name: 'Hashini Perera',
  email: 'hashini@celebratelk.lk',
  role: 'customer',
  isEmailVerified: true,
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('celebratelk.user') ?? 'null') ?? demoUser,
  token: localStorage.getItem('celebratelk.accessToken') ?? 'demo-token',
  loading: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string; role?: Role }) => {
    if (payload.email.includes('@demo')) {
      return {
        user: { ...demoUser, role: payload.role ?? 'customer' },
        token: 'demo-token',
      }
    }
    const { data } = await api.post('/auth/login', payload)
    return data.data as { user: User; token: string }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('celebratelk.user')
      localStorage.removeItem('celebratelk.accessToken')
    },
    switchRole(state, action: PayloadAction<Role>) {
      if (state.user) {
        state.user.role = action.payload
        localStorage.setItem('celebratelk.user', JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('celebratelk.user', JSON.stringify(action.payload.user))
        localStorage.setItem('celebratelk.accessToken', action.payload.token)
      })
      .addCase(login.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { logout, switchRole } = authSlice.actions
export default authSlice.reducer
