import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface PriceRange {
  min?: number
  max?: number
  currency?: string
}

export interface RoomType {
  type: string
  price: number
  capacity: number
}

export interface Hotel {
  id: string
  name: string
  description?: string
  address: string
  city: string
  country?: string
  rating?: number
  phone?: string
  contactEmail?: string
  contactPhone?: string
  websiteUrl?: string
  amenities?: string[]
  imageUrls?: string[]
  checkInTime?: string
  checkOutTime?: string
  priceRange?: PriceRange
  roomTypes?: RoomType[]
  status: 'active' | 'inactive'
}

interface HotelState {
  hotels: Hotel[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: HotelState = {
  hotels: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapHotel = (hotel: any): Hotel => ({
  id: hotel._id || hotel.id,
  name: hotel.name || '',
  description: hotel.description,
  address: hotel.address || '',
  city: hotel.city || '',
  country: hotel.country || 'India',
  rating: hotel.rating,
  phone: hotel.phone,
  contactEmail: hotel.contactEmail,
  contactPhone: hotel.contactPhone,
  websiteUrl: hotel.websiteUrl,
  amenities: hotel.amenities || [],
  imageUrls: hotel.imageUrls || [],
  checkInTime: hotel.checkInTime,
  checkOutTime: hotel.checkOutTime,
  priceRange: hotel.priceRange,
  roomTypes: hotel.roomTypes || [],
  status: hotel.status || 'active',
})

export const fetchHotels = createAsyncThunk(
  'hotel/fetchHotels',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/hotel')
      if (!res.ok) throw new Error('Failed to fetch hotels')
      const data = await res.json()
      return data.map(mapHotel)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createHotel = createAsyncThunk(
  'hotel/createHotel',
  async (hotel: Omit<Hotel, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotel),
      })
      if (!res.ok) throw new Error('Failed to create hotel')
      const data = await res.json()
      return mapHotel(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchHotelById = createAsyncThunk(
  'hotel/fetchHotelById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/hotel/${id}`)
      if (!res.ok) throw new Error('Failed to fetch hotel')
      const data = await res.json()
      return mapHotel(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateHotelById = createAsyncThunk(
  'hotel/updateHotelById',
  async ({ id, data }: { id: string; data: Partial<Hotel> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/hotel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update hotel')
      const responseData = await res.json()
      return mapHotel(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteHotelById = createAsyncThunk(
  'hotel/deleteHotelById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid hotel ID')
      }
      const res = await fetch(`http://localhost:8000/api/hotel/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete hotel')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.ui.loading = false
        state.hotels = action.payload
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createHotel.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.ui.loading = false
        state.hotels.push(action.payload)
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchHotelById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.hotels.findIndex((h) => h.id === action.payload.id)
        if (idx !== -1) {
          state.hotels[idx] = action.payload
        } else {
          state.hotels.push(action.payload)
        }
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateHotelById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateHotelById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.hotels.findIndex((h) => h.id === action.payload.id)
        if (idx !== -1) {
          state.hotels[idx] = action.payload
        }
      })
      .addCase(updateHotelById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteHotelById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteHotelById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.hotels = state.hotels.filter((h) => h.id !== action.payload)
      })
      .addCase(deleteHotelById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default hotelSlice.reducer