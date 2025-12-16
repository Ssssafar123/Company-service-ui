import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Payment {
  id: string
  paymentId: string
  invoiceNumber: string
  invoiceId: string
  paymentMode: string
  transactionId: string
  customer: string
  amount: number
  date: string
  paymentMethod: string
  bankName?: string
  accountNumber?: string
  chequeNumber?: string
  upiId?: string
  cardLast4?: string
  status: 'success' | 'pending' | 'failed' | 'refunded'
  remarks?: string
}

interface PaginationData {
  data: Payment[]
  page: number
  limit: number
  totalPages: number
  totalRecords: number
}

interface PaymentState {
  payments: Payment[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalRecords: number
  }
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: PaymentState = {
  payments: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0
  },
  ui: {
    loading: false,
    error: null
  }
}

const mapPayment = (payment: any): Payment => ({
  id: payment._id || payment.id,
  paymentId: payment.paymentId || '',
  invoiceNumber: payment.invoiceNumber || '',
  invoiceId: payment.invoiceId || '',
  paymentMode: payment.paymentMode || '',
  transactionId: payment.transactionId || '',
  customer: payment.customer || '',
  amount: payment.amount || 0,
  date: payment.date || new Date().toISOString(),
  paymentMethod: payment.paymentMethod || '',
  bankName: payment.bankName,
  accountNumber: payment.accountNumber,
  chequeNumber: payment.chequeNumber,
  upiId: payment.upiId,
  cardLast4: payment.cardLast4,
  status: payment.status || 'success',
  remarks: payment.remarks,
})

export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/payment')
      if (!res.ok) throw new Error('Failed to fetch payments')
      const data = await res.json()
      return data.map(mapPayment)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchPaymentsByPage = createAsyncThunk(
  'payment/fetchPaymentsByPage',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/payment/page?page=${page}&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to fetch payments')
      const response = await res.json()
      return {
        data: response.data.map(mapPayment),
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalRecords: response.totalRecords
      } as PaginationData
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (payment: Omit<Payment, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      })
      if (!res.ok) throw new Error('Failed to create payment')
      const data = await res.json()
      return mapPayment(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchPaymentById = createAsyncThunk(
  'payment/fetchPaymentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/payment/${id}`)
      if (!res.ok) throw new Error('Failed to fetch payment')
      const data = await res.json()
      return mapPayment(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updatePaymentById = createAsyncThunk(
  'payment/updatePaymentById',
  async ({ id, data }: { id: string; data: Partial<Payment> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/payment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update payment')
      const responseData = await res.json()
      return mapPayment(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deletePaymentById = createAsyncThunk(
  'payment/deletePaymentById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid payment ID')
      }
      const res = await fetch(`http://localhost:8000/api/payment/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete payment')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.ui.loading = false
        state.payments = action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchPaymentsByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchPaymentsByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.payments = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords
        }
      })
      .addCase(fetchPaymentsByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createPayment.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.ui.loading = false
        state.payments.push(action.payload)
        state.pagination.totalRecords += 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchPaymentById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.payments.findIndex(p => p.id === action.payload.id)
        if (idx !== -1) {
          state.payments[idx] = action.payload
        } else {
          state.payments.push(action.payload)
        }
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updatePaymentById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updatePaymentById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.payments.findIndex(p => p.id === action.payload.id)
        if (idx !== -1) {
          state.payments[idx] = action.payload
        }
      })
      .addCase(updatePaymentById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deletePaymentById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deletePaymentById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.payments = state.payments.filter(p => p.id !== action.payload)
        state.pagination.totalRecords -= 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(deletePaymentById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  }
})

export default paymentSlice.reducer