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
  short_description?: string
  long_description?: string
  description?: string
  image?: string
  feature_images?: string[]
  status?: 'active' | 'inactive'
  country?: string
  state?: string
  order?: number
  tripCount?: number
  itineraries?: string[]
  seo_fields?: {
    meta_title?: string
    meta_description?: string
    meta_keywords?: string
    og_title?: string
    og_description?: string
    og_image?: string
  } | null
  createdAt?: string
  updatedAt?: string
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
  itineraries: location.itineraries || [],
  seo_fields: location.seo_fields,
})

export const fetchLocations = createAsyncThunk(
  'location/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/location', {
        credentials: 'include',
      })
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
  async (location: Omit<Location, 'id'> & { imageFile?: File, featureImageFiles?: File[] }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      
      // Add basic fields
      formData.append('name', location.name)
      if (location.status) formData.append('status', location.status)
      if (location.short_description) formData.append('short_description', location.short_description)
      if (location.long_description) formData.append('long_description', location.long_description)
      if (location.description) formData.append('description', location.description)
      if (location.state) formData.append('state', location.state)
      if (location.country) formData.append('country', location.country)
      if (location.order !== undefined) formData.append('order', location.order.toString())
      
      // Add itineraries - each ID separately, not as JSON string
      if (location.itineraries && location.itineraries.length > 0) {
        location.itineraries.forEach((itineraryId) => {
          formData.append('itineraries[]', itineraryId)
        })
      }
      
      // Add SEO fields as JSON
      if (location.seo_fields) {
        formData.append('seo_fields', JSON.stringify(location.seo_fields))
      }
      
      // Add image file if present
      if (location.imageFile) {
        formData.append('image', location.imageFile)
      }
      
      // Add feature image files if present
      if (location.featureImageFiles && location.featureImageFiles.length > 0) {
        location.featureImageFiles.forEach((file) => {
          formData.append('feature_images', file)
        })
      }
      
      const res = await fetch('http://localhost:8000/api/location', {
        method: 'POST',
        credentials: 'include',
        body: formData,
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
      const res = await fetch(`http://localhost:8000/api/location/${id}`, {
        credentials: 'include',
      })
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
  async ({ id, data }: { id: string; data: Partial<Location> & { imageFile?: File, featureImageFiles?: File[] } }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      
      // Add basic fields if present
      if (data.name) formData.append('name', data.name)
      if (data.status) formData.append('status', data.status)
      if (data.short_description !== undefined) formData.append('short_description', data.short_description)
      if (data.long_description !== undefined) formData.append('long_description', data.long_description)
      if (data.description !== undefined) formData.append('description', data.description)
      if (data.state !== undefined) formData.append('state', data.state)
      if (data.country !== undefined) formData.append('country', data.country)
      if (data.order !== undefined) formData.append('order', data.order.toString())
      
      // Add itineraries - each ID separately, not as JSON string
      if (data.itineraries !== undefined) {
        if (data.itineraries.length === 0) {
          formData.append('itineraries[]', '') // Send empty to clear
        } else {
          data.itineraries.forEach((itineraryId) => {
            formData.append('itineraries[]', itineraryId)
          })
        }
      }
      
      // Add SEO fields as JSON
      if (data.seo_fields !== undefined) {
        formData.append('seo_fields', JSON.stringify(data.seo_fields))
      }
      
      // Add image file if present
      if (data.imageFile) {
        formData.append('image', data.imageFile)
      }
      
      // Add feature image files if present
      if (data.featureImageFiles && data.featureImageFiles.length > 0) {
        data.featureImageFiles.forEach((file) => {
          formData.append('feature_images', file)
        })
      }
      
      const res = await fetch(`http://localhost:8000/api/location/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
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
        credentials: 'include',
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