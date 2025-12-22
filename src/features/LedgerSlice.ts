import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Ledger {
  id: string
  vendorId: string
  vendorName?: string
  date: string
  type: 'receipt' | 'payment'
  amount: number
  referenceNumber?: string
  description?: string
  balance?: number
  invoiceId?: string
  paymentId?: string
  createdBy?: string
}

interface LedgerState {
  ledgers: Ledger[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: LedgerState = {
  ledgers: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapLedger = (ledger: any): Ledger => ({
  id: ledger._id || ledger.id,
  vendorId: ledger.vendorId || '',
  vendorName: ledger.vendorName,
  date: ledger.date || new Date().toISOString(),
  type: ledger.type || 'payment',
  amount: ledger.amount || 0,
  referenceNumber: ledger.referenceNumber,
  description: ledger.description,
  balance: ledger.balance || 0,
  invoiceId: ledger.invoiceId,
  paymentId: ledger.paymentId,
  createdBy: ledger.createdBy,
})

export const fetchLedgers = createAsyncThunk(
  'ledger/fetchLedgers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/ledger', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch ledgers')
      const data = await res.json()
      return data.map(mapLedger)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createLedger = createAsyncThunk(
  'ledger/createLedger',
  async (ledger: Omit<Ledger, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/ledger', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ledger),
      })
      if (!res.ok) throw new Error('Failed to create ledger')
      const data = await res.json()
      return mapLedger(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchLedgerById = createAsyncThunk(
  'ledger/fetchLedgerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/ledger/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch ledger')
      const data = await res.json()
      return mapLedger(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateLedgerById = createAsyncThunk(
  'ledger/updateLedgerById',
  async ({ id, data }: { id: string; data: Partial<Ledger> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/ledger/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update ledger')
      const responseData = await res.json()
      return mapLedger(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteLedgerById = createAsyncThunk(
  'ledger/deleteLedgerById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid ledger ID')
      }
      const res = await fetch(`http://localhost:8000/api/ledger/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete ledger')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedgers.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLedgers.fulfilled, (state, action) => {
        state.ui.loading = false
        state.ledgers = action.payload
      })
      .addCase(fetchLedgers.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createLedger.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createLedger.fulfilled, (state, action) => {
        state.ui.loading = false
        state.ledgers.push(action.payload)
      })
      .addCase(createLedger.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchLedgerById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLedgerById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.ledgers.findIndex((l) => l.id === action.payload.id)
        if (idx !== -1) {
          state.ledgers[idx] = action.payload
        } else {
          state.ledgers.push(action.payload)
        }
      })
      .addCase(fetchLedgerById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateLedgerById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateLedgerById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.ledgers.findIndex((l) => l.id === action.payload.id)
        if (idx !== -1) {
          state.ledgers[idx] = action.payload
        }
      })
      .addCase(updateLedgerById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteLedgerById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteLedgerById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.ledgers = state.ledgers.filter((l) => l.id !== action.payload)
      })
      .addCase(deleteLedgerById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default ledgerSlice.reducer