import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface LocalSupport {
  id: string
  name: string
  contact: string
  location: string
  supportType: 'Guide' | 'Driver' | 'Translator' | 'Helper' | 'Other'
  rating?: number
  email?: string
  languages?: string[]
  experience?: number
  availability: 'available' | 'busy' | 'unavailable'
  hourlyRate?: number
  dailyRate?: number
  specialties?: string[]
  imageUrl?: string
  address?: string
  status: 'active' | 'inactive'
}

interface PaginationData {
  data: LocalSupport[]
  page: number
  limit: number
  totalPages: number
  totalRecords: number
}

interface LocalSupportState {
  localSupports: LocalSupport[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalRecords: number
  }
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: LocalSupportState = {
  localSupports: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0
  },
  ui: {
    loading: false,
    error: null
  }
}

const mapLocalSupport = (localSupport: any): LocalSupport => ({
  id: localSupport._id || localSupport.id,
  name: localSupport.name || '',
  contact: localSupport.contact || '',
  location: localSupport.location || '',
  supportType: localSupport.supportType || 'Guide',
  rating: localSupport.rating,
  email: localSupport.email,
  languages: localSupport.languages || [],
  experience: localSupport.experience,
  availability: localSupport.availability || 'available',
  hourlyRate: localSupport.hourlyRate,
  dailyRate: localSupport.dailyRate,
  specialties: localSupport.specialties || [],
  imageUrl: localSupport.imageUrl,
  address: localSupport.address,
  status: localSupport.status || 'active',
})

export const fetchLocalSupports = createAsyncThunk(
  'localSupport/fetchLocalSupports',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/localsupport', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch local supports')
      const data = await res.json()
      return data.map(mapLocalSupport)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchLocalSupportsByPage = createAsyncThunk(
  'localSupport/fetchLocalSupportsByPage',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/localsupport/paginate?page=${page}&limit=${limit}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch local supports')
      const response = await res.json()
      return {
        data: response.data.map(mapLocalSupport),
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalRecords: response.totalRecords
      } as PaginationData
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createLocalSupport = createAsyncThunk(
  'localSupport/createLocalSupport',
  async (localSupport: Omit<LocalSupport, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/localsupport', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSupport),
      })
      if (!res.ok) throw new Error('Failed to create local support')
      const data = await res.json()
      return mapLocalSupport(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchLocalSupportById = createAsyncThunk(
  'localSupport/fetchLocalSupportById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/localsupport/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch local support')
      const data = await res.json()
      return mapLocalSupport(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateLocalSupportById = createAsyncThunk(
  'localSupport/updateLocalSupportById',
  async ({ id, data }: { id: string; data: Partial<LocalSupport> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/localsupport/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update local support')
      const responseData = await res.json()
      return mapLocalSupport(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteLocalSupportById = createAsyncThunk(
  'localSupport/deleteLocalSupportById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid local support ID')
      }
      const res = await fetch(`http://localhost:8000/api/localsupport/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete local support')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const localSupportSlice = createSlice({
  name: 'localSupport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocalSupports.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLocalSupports.fulfilled, (state, action) => {
        state.ui.loading = false
        state.localSupports = action.payload
      })
      .addCase(fetchLocalSupports.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchLocalSupportsByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLocalSupportsByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.localSupports = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords
        }
      })
      .addCase(fetchLocalSupportsByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createLocalSupport.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createLocalSupport.fulfilled, (state, action) => {
        state.ui.loading = false
        state.localSupports.push(action.payload)
        state.pagination.totalRecords += 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(createLocalSupport.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchLocalSupportById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLocalSupportById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.localSupports.findIndex(ls => ls.id === action.payload.id)
        if (idx !== -1) {
          state.localSupports[idx] = action.payload
        } else {
          state.localSupports.push(action.payload)
        }
      })
      .addCase(fetchLocalSupportById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateLocalSupportById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateLocalSupportById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.localSupports.findIndex(ls => ls.id === action.payload.id)
        if (idx !== -1) {
          state.localSupports[idx] = action.payload
        }
      })
      .addCase(updateLocalSupportById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteLocalSupportById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteLocalSupportById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.localSupports = state.localSupports.filter(ls => ls.id !== action.payload)
        state.pagination.totalRecords -= 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(deleteLocalSupportById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  }
})

export default localSupportSlice.reducer