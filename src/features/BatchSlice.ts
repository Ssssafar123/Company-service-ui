import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Batch {
  id: string
  start_date: string
  end_date: string
  is_sold: boolean
  extra_amount: number
  extra_reason?: string
  itineraryId: string
  createdAt?: string
  updatedAt?: string
}

interface BatchState {
  batches: Batch[]
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

const initialState: BatchState = {
  batches: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  },
  ui: {
    loading: false,
    error: null,
  },
}

// Helper function to map _id to id
const mapBatch = (batch: any): Batch => {
  // Handle itineraryId - it might be a populated object or a string
  let itineraryId = ''
  if (batch.itineraryId) {
    if (typeof batch.itineraryId === 'string') {
      itineraryId = batch.itineraryId
    } else if (batch.itineraryId._id) {
      itineraryId = batch.itineraryId._id
    } else if (batch.itineraryId.id) {
      itineraryId = batch.itineraryId.id
    }
  }
  
  return {
    id: batch._id || batch.id,
    start_date: batch.start_date || '',
    end_date: batch.end_date || '',
    is_sold: batch.is_sold || false,
    extra_amount: batch.extra_amount || 0,
    extra_reason: batch.extra_reason,
    itineraryId: itineraryId,
    createdAt: batch.createdAt,
    updatedAt: batch.updatedAt,
  }
}

// Fetch all batches
export const fetchBatches = createAsyncThunk(
  'batch/fetchBatches',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('batch'), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch batches')
      const data = await res.json()
      return data.map(mapBatch)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch batches by pagination
export const fetchBatchesByPage = createAsyncThunk(
  'batch/fetchBatchesByPage',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`batch/paginate?page=${page}&limit=${limit}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch batches')
      const data = await res.json()
      return {
        batches: data.batches.map(mapBatch),
        pagination: {
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
          totalRecords: data.totalRecords,
        },
      }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch batch by ID
export const fetchBatchById = createAsyncThunk(
  'batch/fetchBatchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`batch/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch batch')
      const data = await res.json()
      return mapBatch(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Create new batch
export const createBatch = createAsyncThunk(
  'batch/createBatch',
  async (batch: Omit<Batch, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('batch'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create batch')
      }
      const data = await res.json()
      return mapBatch(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Update batch by ID
export const updateBatchById = createAsyncThunk(
  'batch/updateBatchById',
  async ({ id, data }: { id: string; data: Partial<Batch> }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`batch/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to update batch')
      }
      const responseData = await res.json()
      return mapBatch(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Delete batch by ID
export const deleteBatchById = createAsyncThunk(
  'batch/deleteBatchById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid batch ID')
      }
      const res = await fetch(getApiUrl(`batch/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete batch')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all batches
      .addCase(fetchBatches.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.ui.loading = false
        state.batches = action.payload
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch batches by pagination
      .addCase(fetchBatchesByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchBatchesByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.batches = action.payload.batches
        state.pagination = action.payload.pagination
      })
      .addCase(fetchBatchesByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch batch by ID
      .addCase(fetchBatchById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchBatchById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.batches.findIndex((b) => b.id === action.payload.id)
        if (idx !== -1) {
          state.batches[idx] = action.payload
        } else {
          state.batches.push(action.payload)
        }
      })
      .addCase(fetchBatchById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Create batch
      .addCase(createBatch.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.ui.loading = false
        state.batches.push(action.payload)
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Update batch by ID
      .addCase(updateBatchById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateBatchById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.batches.findIndex((b) => b.id === action.payload.id)
        if (idx !== -1) {
          state.batches[idx] = action.payload
        }
      })
      .addCase(updateBatchById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Delete batch by ID
      .addCase(deleteBatchById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteBatchById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.batches = state.batches.filter((b) => b.id !== action.payload)
      })
      .addCase(deleteBatchById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default batchSlice.reducer
