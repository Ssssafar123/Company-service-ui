import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
  tax?: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  totalTax: number
  date: string
  customer: string
  billTo?: string
  shipTo?: string
  customerEmail?: string
  customerPhone?: string
  project?: string
  tags?: string[]
  dueDate: string
  preventOverdueReminders?: boolean
  status: 'paid' | 'partially_paid' | 'unpaid' | 'overdue' | 'draft' | 'cancelled'
  tripStartingDate?: string
  location?: string
  itineraryId?: string
  bookingId?: string
  b2bDeal?: string
  gst?: string
  gstAmount?: number
  paidAmount?: number
  remainingAmount?: number
  paymentTerms?: string
  allowedPaymentModes?: string[]
  currency?: string
  saleAgent?: string
  isRecurring?: boolean
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  lineItems?: LineItem[]
  quantityAs?: 'Qty' | 'Hours' | 'Qty/Hours'
  adjustment?: number
  adminNote?: string
  clientNote?: string
  termsAndConditions?: string
  notes?: string
}

interface PaginationData {
  data: Invoice[]
  page: number
  limit: number
  totalPages: number
  totalRecords: number
}

interface InvoiceState {
  invoices: Invoice[]
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

const initialState: InvoiceState = {
  invoices: [],
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

const mapInvoice = (invoice: any): Invoice => ({
  id: invoice._id || invoice.id,
  invoiceNumber: invoice.invoiceNumber || '',
  amount: invoice.amount || 0,
  totalTax: invoice.totalTax || 0,
  date: invoice.date || new Date().toISOString(),
  customer: invoice.customer || '',
  billTo: invoice.billTo,
  shipTo: invoice.shipTo,
  customerEmail: invoice.customerEmail,
  customerPhone: invoice.customerPhone,
  project: invoice.project,
  tags: invoice.tags || [],
  dueDate: invoice.dueDate || new Date().toISOString(),
  preventOverdueReminders: invoice.preventOverdueReminders || false,
  status: invoice.status || 'unpaid',
  tripStartingDate: invoice.tripStartingDate,
  location: invoice.location,
  itineraryId: invoice.itineraryId,
  bookingId: invoice.bookingId,
  b2bDeal: invoice.b2bDeal,
  gst: invoice.gst,
  gstAmount: invoice.gstAmount,
  paidAmount: invoice.paidAmount || 0,
  remainingAmount: invoice.remainingAmount,
  paymentTerms: invoice.paymentTerms,
  allowedPaymentModes: invoice.allowedPaymentModes || [],
  currency: invoice.currency || 'INR',
  saleAgent: invoice.saleAgent,
  isRecurring: invoice.isRecurring || false,
  discountType: invoice.discountType || 'fixed',
  discountValue: invoice.discountValue || 0,
  lineItems: invoice.lineItems || [],
  quantityAs: invoice.quantityAs || 'Qty',
  adjustment: invoice.adjustment || 0,
  adminNote: invoice.adminNote,
  clientNote: invoice.clientNote,
  termsAndConditions: invoice.termsAndConditions,
  notes: invoice.notes,
})

export const fetchInvoices = createAsyncThunk(
  'invoice/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/invoice', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch invoices')
      const data = await res.json()
      return data.map(mapInvoice)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchInvoicesByPage = createAsyncThunk(
  'invoice/fetchInvoicesByPage',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/invoice/page?page=${page}&limit=${limit}`,
        { credentials: 'include' }
      )

      if (!res.ok) throw new Error('Failed to fetch invoices')

      const response = await res.json()

      // 🔴 NORMALIZE BACKEND RESPONSE
      const list =
        response.data || response.rows || []

      const totalRecords =
        response.totalRecords ??
        response.total ??
        response.count ??
        list.length

      return {
        data: list.map(mapInvoice),
        page: response.page ?? page,
        limit: response.limit ?? limit,
        totalPages:
          response.totalPages ??
          Math.ceil(totalRecords / limit),
        totalRecords,
      }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (invoice: Omit<Invoice, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/invoice', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      })
      if (!res.ok) throw new Error('Failed to create invoice')
      const data = await res.json()
      return mapInvoice(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchInvoiceById = createAsyncThunk(
  'invoice/fetchInvoiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/invoice/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch invoice')
      const data = await res.json()
      return mapInvoice(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateInvoiceById = createAsyncThunk(
  'invoice/updateInvoiceById',
  async ({ id, data }: { id: string; data: Partial<Invoice> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/invoice/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update invoice')
      const responseData = await res.json()
      return mapInvoice(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteInvoiceById = createAsyncThunk(
  'invoice/deleteInvoiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid invoice ID')
      }
      const res = await fetch(`http://localhost:8000/api/invoice/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete invoice')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.ui.loading = false
        state.invoices = action.payload
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchInvoicesByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchInvoicesByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.invoices = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords
        }
      })
      .addCase(fetchInvoicesByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createInvoice.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.ui.loading = false
        state.invoices.push(action.payload)
        state.pagination.totalRecords += 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.invoices.findIndex(i => i.id === action.payload.id)
        if (idx !== -1) {
          state.invoices[idx] = action.payload
        } else {
          state.invoices.push(action.payload)
        }
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateInvoiceById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateInvoiceById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.invoices.findIndex(i => i.id === action.payload.id)
        if (idx !== -1) {
          state.invoices[idx] = action.payload
        }
      })
      .addCase(updateInvoiceById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteInvoiceById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteInvoiceById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.invoices = state.invoices.filter(i => i.id !== action.payload)
        state.pagination.totalRecords -= 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(deleteInvoiceById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  }
})

export default invoiceSlice.reducer