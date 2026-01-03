import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface User {
  id: string
  username: string
  companyId: string
  role?: {
    id: string
    name: string
    modules: string[]
  }
}

interface UserState {
  users: User[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: UserState = {
  users: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapUser = (user: any): User => ({
  id: user._id || user.id,
  username: user.username || '',
  companyId: user.companyId || '',
  role: user.role
    ? {
        id: user.role._id || user.role.id,
        name: user.role.name || '',
        modules: user.role.modules || [],
      }
    : undefined,
})

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('user-management'), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      return Array.isArray(data) ? data.map(mapUser) : []
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createUser = createAsyncThunk(
  'user/createUser',
  async (user: Omit<User, 'id'> & { password?: string }, { rejectWithValue }) => {
    try {
      const payload: any = {
        username: user.username,
        companyId: user.companyId,
        password: user.password,
      }
      // Only include role if it's provided and not empty
      if (user.role?.id && user.role.id.trim() !== '') {
        payload.role = user.role.id
      }
      
      const res = await fetch(getApiUrl('user-management'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || `Failed to create user: ${res.status} ${res.statusText}`
        throw new Error(errorMessage)
      }
      const data = await res.json()
      return mapUser(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`user-management/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      return mapUser(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateUserById = createAsyncThunk(
  'user/updateUserById',
  async (
    { id, data }: { id: string; data: Partial<User> & { password?: string } },
    { rejectWithValue }
  ) => {
    try {
      const payload: any = {
        username: data.username,
        companyId: data.companyId,
      }
      // Only include role if it's provided and not empty
      if (data.role?.id && data.role.id.trim() !== '') {
        payload.role = data.role.id
      }
      // Only include password if it's provided
      if (data.password && data.password.trim() !== '') {
        payload.password = data.password
      }
      
      const res = await fetch(getApiUrl(`user-management/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || `Failed to update user: ${res.status} ${res.statusText}`
        throw new Error(errorMessage)
      }
      const responseData = await res.json()
      return mapUser(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteUserById = createAsyncThunk(
  'user/deleteUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid user ID')
      }
      const res = await fetch(getApiUrl(`user-management/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete user')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.ui.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createUser.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.ui.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchUserById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) {
          state.users[idx] = action.payload
        } else {
          state.users.push(action.payload)
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateUserById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) {
          state.users[idx] = action.payload
        }
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteUserById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.users = state.users.filter((u) => u.id !== action.payload)
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default userSlice.reducer

