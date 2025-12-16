import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'



export interface Itinerary {
  id: string
  name: string
  city: string
  price: number
  status: 'Active' | 'Inactive'
  trending: string
}

export interface Category {
  id: string
  name: string
  image: string
  tripCount: number
  order?: number
}

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

export interface Lead {
  id: number
  name: string
  badgeType: string
  leadId: string
  time: string
  phone: string
  destination: string
  packageCode: string
  remarks: string
  status: string
  contacted: string
  assignedTo: string
}

export interface Batch {
  id: string
  start_date: string
  end_date: string
  extra_amount: number
  extra_amount_reason: string
  sold_out: boolean
}

export interface UIState {
  sidebarOpen: boolean
  loading: boolean
  searchQuery: string
  error: string | null
}

interface AppState {
  itineraries: Itinerary[]
  categories: Category[]
  bookings: Booking[]
  leads: Lead[]
  batches: Batch[]
  ui: UIState
}

/* INITIAL STATE  */

const initialState: AppState = {
  itineraries: [],
  categories: [],
  bookings: [],
  leads: [],
  batches: [],
  ui: {
    sidebarOpen: true,
    loading: false,
    searchQuery: '',
    error: null,
  },
}

/*  THUNKS  */

export const fetchItineraries = createAsyncThunk(
  'app/fetchItineraries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/itineraries')
      if (!res.ok) throw new Error('Failed to fetch itineraries')
      return (await res.json()) as Itinerary[]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'app/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return (await res.json()) as Category[]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchBookings = createAsyncThunk(
  'app/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      return (await res.json()) as Booking[]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchLeads = createAsyncThunk(
  'app/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error('Failed to fetch leads')
      return (await res.json()) as Lead[]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createBooking = createAsyncThunk(
  'app/createBooking',
  async (booking: Omit<Booking, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error('Failed to create booking')
      return (await res.json()) as Booking
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

/*  SLICE  */

const appSlice = createSlice({
  name: 'app',
  initialState,

  /*  UI reducers only  */
  reducers: {
    toggleSidebar: (state) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.searchQuery = action.payload
    },
    clearError: (state) => {
      state.ui.error = null
    },
  },

  /*  Async reducers  */
  extraReducers: (builder) => {
    builder

      // Itineraries
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

      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.ui.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.ui.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Leads
      .addCase(fetchLeads.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.ui.loading = false
        state.leads = action.payload
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.ui.loading = false
        state.bookings.push(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

/* ================= EXPORTS ================= */

export const {
  toggleSidebar,
  setSearchQuery,
  clearError,
} = appSlice.actions

export default appSlice.reducer
