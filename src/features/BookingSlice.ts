import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Booking {
  id: string
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  itinerary: string
  bookingDate: string
  travelDate: string
  numberOfTravelers: number
  totalAmount: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  paymentStatus?: 'paid' | 'pending' | 'refunded'
}

interface PaginationData {
  data: Booking[]
  page: number
  limit: number
  totalPages: number
  totalRecords: number
}

interface AppState{
    booking : Booking[]
    pagination: {
      page: number
      limit: number
      totalPages: number
      totalRecords: number
    }
    ui:{
        loading : boolean
        error : string | null
    }
}

const initialState: AppState = {
    booking : [],
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 0,
      totalRecords: 0
    },
    ui : {
        loading : false,
        error : null
    }
}

// Helper function to map _id to id
const mapBooking = (booking: any): Booking => ({
  id: booking._id || booking.id,
  bookingId: booking.bookingId,
  customerName: booking.customerName,
  customerEmail: booking.customerEmail,
  customerPhone: booking.customerPhone,
  itinerary: booking.itinerary,
  bookingDate: booking.bookingDate,
  travelDate: booking.travelDate,
  numberOfTravelers: booking.numberOfTravelers,
  totalAmount: booking.totalAmount,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
})

export const fetchBookings = createAsyncThunk(
  'app/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/booking')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      return data.map(mapBooking)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// New thunk for paginated bookings
export const fetchBookingsByPage = createAsyncThunk(
  'app/fetchBookingsByPage',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      // Use query parameters on base endpoint instead of /page route
      // This avoids conflict with /api/booking/:id route
      const res = await fetch(`http://localhost:8000/api/booking?page=${page}&limit=${limit}`)
      
      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to fetch bookings'
        try {
          const errorData = await res.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      const response = await res.json()
      
      // Handle different response formats
      if (Array.isArray(response)) {
        // If API returns array directly, wrap it
        return {
          data: response.map(mapBooking),
          page: page,
          limit: limit,
          totalPages: Math.ceil(response.length / limit),
          totalRecords: response.length
        } as PaginationData
      }
      
      // Handle paginated response format
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data.map(mapBooking),
          page: response.page || page,
          limit: response.limit || limit,
          totalPages: response.totalPages || Math.ceil((response.totalRecords || response.data.length) / (response.limit || limit)),
          totalRecords: response.totalRecords || response.data.length
        } as PaginationData
      }
      
      // Fallback: empty data
      return {
        data: [],
        page: page,
        limit: limit,
        totalPages: 0,
        totalRecords: 0
      } as PaginationData
    } catch (err) {
      console.error('Error fetching bookings:', err)
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createBooking = createAsyncThunk(
  'app/createBooking',
  async (booking: Omit<Booking, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error('Failed to create booking')
      const data = await res.json()
      return mapBooking(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchBookingById = createAsyncThunk(
  'app/fetchBookingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/booking/${id}`)
      if (!res.ok) throw new Error('Failed to fetch booking')
      const data = await res.json()
      return mapBooking(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateBookingById = createAsyncThunk(
  'app/updateBookingById',
  async ({ id, data }: { id: string; data: Partial<Booking> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/booking/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update booking')
      const responseData = await res.json()
      return mapBooking(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteBookingById = createAsyncThunk(
  'app/deleteBookingById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid booking ID')
      }
      const res = await fetch(`http://localhost:8000/api/booking/${id}`, { 
        method: 'DELETE' 
      })
      if (!res.ok) throw new Error('Failed to delete booking')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending , (state) => {
        state.ui.loading = true
        state.ui.error = null
    })
    .addCase(fetchBookings.fulfilled, (state, action) => {
        state.ui.loading = false
        state.booking = action.payload
    })
    .addCase(fetchBookings.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
    })

    // Fetch bookings by page
    .addCase(fetchBookingsByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
    })
    .addCase(fetchBookingsByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.booking = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords
        }
    })
    .addCase(fetchBookingsByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
    })

    .addCase(createBooking.pending , (state) => {
        state.ui.loading = true
        state.ui.error = null
    })
    .addCase(createBooking.fulfilled, (state, action) => {
        state.ui.loading = false
        state.booking.push(action.payload)
        state.pagination.totalRecords += 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
    })
    .addCase(createBooking.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
    })

    // Fetch booking by ID
    .addCase(fetchBookingById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.booking.findIndex(b => b.id === action.payload.id)
        if (idx !== -1) {
          state.booking[idx] = action.payload
        } else {
          state.booking.push(action.payload)
        }
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Update booking by ID
      .addCase(updateBookingById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateBookingById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.booking.findIndex(b => b.id === action.payload.id)
        if (idx !== -1) {
          state.booking[idx] = action.payload
        }
      })
      .addCase(updateBookingById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Delete booking by ID
      .addCase(deleteBookingById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteBookingById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.booking = state.booking.filter(b => b.id !== action.payload)
        state.pagination.totalRecords -= 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(deleteBookingById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  }
})

export default bookingSlice.reducer