import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Transport {
  id: string
  vehicleType: string
  vehicleNumber: string
  capacity: number
  price: number
  priceType: 'Per Tour' | 'Per Km' | 'Per Day'
  routes?: string
  vendorName: string
  vendorId?: string
  vendorLocation?: string
  contact: string
  rating?: number
  lastUpdated?: string
  availability: 'available' | 'booked' | 'maintenance' | 'unavailable'
  features?: string[]
  insuranceDetails?: string
  licenseNumber?: string
  status: 'active' | 'inactive'
}

interface TransportState {
  transports: Transport[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: TransportState = {
  transports: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapTransport = (transport: any): Transport => ({
  id: transport._id || transport.id,
  vehicleType: transport.vehicleType || '',
  vehicleNumber: transport.vehicleNumber || '',
  capacity: transport.capacity || 0,
  price: transport.price || 0,
  priceType: transport.priceType || 'Per Tour',
  routes: transport.routes,
  vendorName: transport.vendorName || '',
  vendorId: transport.vendorId,
  vendorLocation: transport.vendorLocation,
  contact: transport.contact || '',
  rating: transport.rating,
  lastUpdated: transport.lastUpdated || new Date().toISOString(),
  availability: transport.availability || 'available',
  features: transport.features || [],
  insuranceDetails: transport.insuranceDetails,
  licenseNumber: transport.licenseNumber,
  status: transport.status || 'active',
})

export const fetchTransports = createAsyncThunk(
  'transport/fetchTransports',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/transport')
      if (!res.ok) throw new Error('Failed to fetch transports')
      const data = await res.json()
      return data.map(mapTransport)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createTransport = createAsyncThunk(
  'transport/createTransport',
  async (transport: Omit<Transport, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transport),
      })
      if (!res.ok) throw new Error('Failed to create transport')
      const data = await res.json()
      return mapTransport(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchTransportById = createAsyncThunk(
  'transport/fetchTransportById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/transport/${id}`)
      if (!res.ok) throw new Error('Failed to fetch transport')
      const data = await res.json()
      return mapTransport(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateTransportById = createAsyncThunk(
  'transport/updateTransportById',
  async ({ id, data }: { id: string; data: Partial<Transport> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/transport/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update transport')
      const responseData = await res.json()
      return mapTransport(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteTransportById = createAsyncThunk(
  'transport/deleteTransportById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid transport ID')
      }
      const res = await fetch(`http://localhost:8000/api/transport/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete transport')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransports.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchTransports.fulfilled, (state, action) => {
        state.ui.loading = false
        state.transports = action.payload
      })
      .addCase(fetchTransports.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createTransport.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createTransport.fulfilled, (state, action) => {
        state.ui.loading = false
        state.transports.push(action.payload)
      })
      .addCase(createTransport.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchTransportById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchTransportById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.transports.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) {
          state.transports[idx] = action.payload
        } else {
          state.transports.push(action.payload)
        }
      })
      .addCase(fetchTransportById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateTransportById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateTransportById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.transports.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) {
          state.transports[idx] = action.payload
        }
      })
      .addCase(updateTransportById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteTransportById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteTransportById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.transports = state.transports.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTransportById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default transportSlice.reducer