import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface SEOFields {
  index_status?: 'index' | 'notindex'
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  author?: string
}

export interface Location {
  id: string
  name: string
  image: string
  feature_images?: string[]
  short_description?: string
  long_description?: string
  description?: string
  state?: string
  country?: string
  tripCount?: number
  order?: number
  status: 'active' | 'inactive'
  seo_fields?: SEOFields
}

interface LocationState {
  locations: Location[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: LocationState = {
  locations: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapLocation = (location: any): Location => ({
  id: location._id || location.id,
  name: location.name || '',
  image: location.image || '',
  feature_images: location.feature_images || [],
  short_description: location.short_description,
  long_description: location.long_description,
  description: location.description,
  state: location.state,
  country: location.country || 'India',
  tripCount: location.tripCount || 0,
  order: location.order || 0,
  status: location.status || 'active',
  seo_fields: location.seo_fields,
})

export const fetchLocations = createAsyncThunk(
  'location/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/location')
      if (!res.ok) throw new Error('Failed to fetch locations')
      const data = await res.json()
      return data.map(mapLocation)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createLocation = createAsyncThunk(
  'location/createLocation',
  async (location: Omit<Location, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      })
      if (!res.ok) throw new Error('Failed to create location')
      const data = await res.json()
      return mapLocation(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchLocationById = createAsyncThunk(
  'location/fetchLocationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/location/${id}`)
      if (!res.ok) throw new Error('Failed to fetch location')
      const data = await res.json()
      return mapLocation(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateLocationById = createAsyncThunk(
  'location/updateLocationById',
  async ({ id, data }: { id: string; data: Partial<Location> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/location/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update location')
      const responseData = await res.json()
      return mapLocation(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteLocationById = createAsyncThunk(
  'location/deleteLocationById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid location ID')
      }
      const res = await fetch(`http://localhost:8000/api/location/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete location')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.ui.loading = false
        state.locations = action.payload
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createLocation.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.ui.loading = false
        state.locations.push(action.payload)
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchLocationById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.locations.findIndex((l) => l.id === action.payload.id)
        if (idx !== -1) {
          state.locations[idx] = action.payload
        } else {
          state.locations.push(action.payload)
        }
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateLocationById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateLocationById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.locations.findIndex((l) => l.id === action.payload.id)
        if (idx !== -1) {
          state.locations[idx] = action.payload
        }
      })
      .addCase(updateLocationById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteLocationById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteLocationById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.locations = state.locations.filter((l) => l.id !== action.payload)
      })
      .addCase(deleteLocationById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default locationSlice.reducer