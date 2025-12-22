import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Itinerary {
  id: string
  name: string // Changed from 'title'
  city: string // Changed from 'destination'
  description: string
  duration: string // Your backend sends "5D 4N"
  price: number
  startDate: string
  endDate: string
  maxTravelers?: number
  availableSeats?: number
  inclusions: string[]
  exclusions: string[]
  highlights?: string[]
  status: 'active' | 'inactive' | 'Active' | 'Inactive' | 'draft'
  imageUrl?: string
  priceDisplay?: string
  trending?: string
}

interface ItineraryState {
  itineraries: Itinerary[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: ItineraryState = {
  itineraries: [],
  ui: {
    loading: false,
    error: null,
  },
}

// Helper function to map _id to id
const mapItinerary = (itinerary: any): Itinerary => ({
  id: itinerary._id || itinerary.id,
  name: itinerary.name || '',
  city: itinerary.city || '',
  description: itinerary.description || '',
  duration: itinerary.duration || '',
  price: itinerary.price || 0,
  startDate: itinerary.startDate || '',
  endDate: itinerary.endDate || '',
  maxTravelers: itinerary.maxTravelers || 0,
  availableSeats: itinerary.availableSeats || 0,
  inclusions: itinerary.inclusions || [],
  exclusions: itinerary.exclusions || [],
  highlights: itinerary.highlights || [],
  status: itinerary.status || 'inactive',
  imageUrl: itinerary.brochureBanner || (itinerary.images && itinerary.images[0]) || '',
  priceDisplay: itinerary.priceDisplay || `₹${itinerary.price?.toLocaleString('en-IN')}`,
  trending: itinerary.trending || 'No',
})

// Fetch all itineraries
export const fetchItineraries = createAsyncThunk(
  'itinerary/fetchItineraries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/itinerary', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch itineraries')
      const data = await res.json()
      return data.map(mapItinerary)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Create new itinerary
export const createItinerary = createAsyncThunk(
  'itinerary/createItinerary',
  async (itinerary: Omit<Itinerary, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/itinerary', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itinerary),
      })
      if (!res.ok) throw new Error('Failed to create itinerary')
      const data = await res.json()
      return mapItinerary(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch itinerary by ID
export const fetchItineraryById = createAsyncThunk(
  'itinerary/fetchItineraryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/itinerary/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch itinerary')
      const data = await res.json()
      return mapItinerary(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Update itinerary by ID
export const updateItineraryById = createAsyncThunk(
  'itinerary/updateItineraryById',
  async ({ id, data }: { id: string; data: Partial<Itinerary> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/itinerary/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update itinerary')
      const responseData = await res.json()
      return mapItinerary(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Delete itinerary by ID
export const deleteItineraryById = createAsyncThunk(
  'itinerary/deleteItineraryById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid itinerary ID')
      }
      const res = await fetch(`http://localhost:8000/api/itinerary/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete itinerary')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all itineraries
      .addCase(fetchItineraries.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchItineraries.fulfilled, (state, action) => {
        state.ui.loading = false
        state.itineraries = action.payload
      })
      .addCase(fetchItineraries.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Create itinerary
      .addCase(createItinerary.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createItinerary.fulfilled, (state, action) => {
        state.ui.loading = false
        state.itineraries.push(action.payload)
      })
      .addCase(createItinerary.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch itinerary by ID
      .addCase(fetchItineraryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchItineraryById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.itineraries.findIndex((i) => i.id === action.payload.id)
        if (idx !== -1) {
          state.itineraries[idx] = action.payload
        } else {
          state.itineraries.push(action.payload)
        }
      })
      .addCase(fetchItineraryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Update itinerary by ID
      .addCase(updateItineraryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateItineraryById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.itineraries.findIndex((i) => i.id === action.payload.id)
        if (idx !== -1) {
          state.itineraries[idx] = action.payload
        }
      })
      .addCase(updateItineraryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Delete itinerary by ID
      .addCase(deleteItineraryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteItineraryById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.itineraries = state.itineraries.filter((i) => i.id !== action.payload)
      })
      .addCase(deleteItineraryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default itinerarySlice.reducer