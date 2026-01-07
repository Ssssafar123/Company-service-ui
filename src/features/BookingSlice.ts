import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Booking {
  id: string
  customer?: string // ObjectId reference
  people_count: number
  travellers: string[] // Array of ObjectId references
  itinerary_id: string // ObjectId reference
  batch_id: string // ObjectId reference
  total_price: number
  paid_amount: number
  invoice_link?: string
  transaction?: string // ObjectId reference
  txn_id: string
  transaction_status?: 'INITIATED' | 'SUCCESS' | 'FAILED'
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
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
const mapBooking = (booking: any): Booking => {
  // Helper to extract ID from string or object
  const extractId = (value: any): string => {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      return value._id || value.id || ''
    }
    return String(value || '')
  }

  return {
    id: booking._id || booking.id,
    customer: extractId(booking.customer),
    people_count: booking.people_count || 0,
    travellers: Array.isArray(booking.travellers) 
      ? booking.travellers.map((t: any) => extractId(t))
      : [],
    itinerary_id: extractId(booking.itinerary_id),
    batch_id: extractId(booking.batch_id),
    total_price: booking.total_price || 0,
    paid_amount: booking.paid_amount || 0,
    invoice_link: booking.invoice_link || '',
    transaction: extractId(booking.transaction),
    txn_id: booking.txn_id || '',
    transaction_status: booking.transaction_status,
    deleted: booking.deleted || false,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }
}

export const fetchBookings = createAsyncThunk(
  'app/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('booking'), {
        credentials: 'include',
      })
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
      const res = await fetch(getApiUrl(`booking?page=${page}&limit=${limit}`), {
        credentials: 'include',
      })
      
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
      const res = await fetch(getApiUrl('booking'), {
        method: 'POST',
        credentials: 'include',
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
      const res = await fetch(getApiUrl(`booking/${id}`), {
        credentials: 'include',
      })
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
      const res = await fetch(getApiUrl(`booking/${id}`), {
        method: 'PUT',
        credentials: 'include',
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
      const res = await fetch(getApiUrl(`booking/${id}`), { 
        method: 'DELETE',
        credentials: 'include',
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