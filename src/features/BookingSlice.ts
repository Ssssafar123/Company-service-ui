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


interface AppState{
    booking : Booking[]
    ui:{
        loading : boolean
        error : string | null
    }
}

const initialState: AppState = {
    booking : [],
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

    .addCase(createBooking.pending , (state) => {
        state.ui.loading = true
        state.ui.error = null
    })
    .addCase(createBooking.fulfilled, (state, action) => {
        state.ui.loading = false
        state.booking.push(action.payload)
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
        // Optionally, you can add/update the booking in the array
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
      })
      .addCase(deleteBookingById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  }
})

export default bookingSlice.reducer