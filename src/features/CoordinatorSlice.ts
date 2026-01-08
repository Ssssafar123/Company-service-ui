import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Coordinator {
  id: string
  name: string
  email: string
  phone: string
  city?: string // Current City
  description?: string // Description field
  specialties?: string[]
  bio?: string
  languages?: string[]
  experience?: number
  rating?: number
  location?: string
  availability: 'full-time' | 'part-time' | 'available' | 'busy' | 'unavailable' // Updated
  imageUrl?: string
  certifications?: string[]
  status: 'active' | 'inactive'
}

interface CoordinatorState {
  coordinators: Coordinator[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: CoordinatorState = {
  coordinators: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapCoordinator = (coordinator: any): Coordinator => ({
  id: coordinator._id || coordinator.id,
  name: coordinator.name || '',
  email: coordinator.email || '',
  phone: coordinator.phone || '',
  city: coordinator.city, // Added
  description: coordinator.description, // Added
  specialties: coordinator.specialties || [],
  bio: coordinator.bio,
  languages: coordinator.languages || [],
  experience: coordinator.experience,
  rating: coordinator.rating,
  location: coordinator.location,
  availability: coordinator.availability || 'full-time', // Updated default
  imageUrl: coordinator.imageUrl,
  certifications: coordinator.certifications || [],
  status: coordinator.status || 'active',
})

export const fetchCoordinators = createAsyncThunk(
  'coordinator/fetchCoordinators',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('coordinator'), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch coordinators')
      const data = await res.json()
      return data.map(mapCoordinator)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createCoordinator = createAsyncThunk(
  'coordinator/createCoordinator',
  async (coordinator: Omit<Coordinator, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('coordinator'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coordinator),
      })
      if (!res.ok) throw new Error('Failed to create coordinator')
      const data = await res.json()
      return mapCoordinator(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchCoordinatorById = createAsyncThunk(
  'coordinator/fetchCoordinatorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`coordinator/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch coordinator')
      const data = await res.json()
      return mapCoordinator(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateCoordinatorById = createAsyncThunk(
  'coordinator/updateCoordinatorById',
  async ({ id, data }: { id: string; data: Partial<Coordinator> }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`coordinator/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update coordinator')
      const responseData = await res.json()
      return mapCoordinator(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteCoordinatorById = createAsyncThunk(
  'coordinator/deleteCoordinatorById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid coordinator ID')
      }
      const res = await fetch(getApiUrl(`coordinator/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete coordinator')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const coordinatorSlice = createSlice({
  name: 'coordinator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoordinators.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCoordinators.fulfilled, (state, action) => {
        state.ui.loading = false
        state.coordinators = action.payload
      })
      .addCase(fetchCoordinators.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createCoordinator.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createCoordinator.fulfilled, (state, action) => {
        state.ui.loading = false
        state.coordinators.push(action.payload)
      })
      .addCase(createCoordinator.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchCoordinatorById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCoordinatorById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.coordinators.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.coordinators[idx] = action.payload
        } else {
          state.coordinators.push(action.payload)
        }
      })
      .addCase(fetchCoordinatorById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateCoordinatorById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateCoordinatorById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.coordinators.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.coordinators[idx] = action.payload
        }
      })
      .addCase(updateCoordinatorById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteCoordinatorById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteCoordinatorById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.coordinators = state.coordinators.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCoordinatorById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default coordinatorSlice.reducer