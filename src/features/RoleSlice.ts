import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Role {
  id: string
  name: string
  modules: string[]
}

interface RoleState {
  roles: Role[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: RoleState = {
  roles: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapRole = (role: any): Role => ({
  id: role._id || role.id,
  name: role.name || '',
  modules: role.modules || [],
})

export const fetchRoles = createAsyncThunk(
  'role/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('role'), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch roles')
      const data = await res.json()
      return Array.isArray(data) ? data.map(mapRole) : []
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createRole = createAsyncThunk(
  'role/createRole',
  async (role: Omit<Role, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('role'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create role')
      }
      const data = await res.json()
      return mapRole(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchRoleById = createAsyncThunk(
  'role/fetchRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`role/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch role')
      const data = await res.json()
      return mapRole(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateRoleById = createAsyncThunk(
  'role/updateRoleById',
  async ({ id, data }: { id: string; data: Partial<Role> }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`role/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update role')
      }
      const responseData = await res.json()
      return mapRole(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteRoleById = createAsyncThunk(
  'role/deleteRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid role ID')
      }
      const res = await fetch(getApiUrl(`role/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete role')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.ui.loading = false
        state.roles = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createRole.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.ui.loading = false
        state.roles.push(action.payload)
      })
      .addCase(createRole.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchRoleById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.roles.findIndex((r) => r.id === action.payload.id)
        if (idx !== -1) {
          state.roles[idx] = action.payload
        } else {
          state.roles.push(action.payload)
        }
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateRoleById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateRoleById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.roles.findIndex((r) => r.id === action.payload.id)
        if (idx !== -1) {
          state.roles[idx] = action.payload
        }
      })
      .addCase(updateRoleById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteRoleById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteRoleById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.roles = state.roles.filter((r) => r.id !== action.payload)
      })
      .addCase(deleteRoleById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default roleSlice.reducer

