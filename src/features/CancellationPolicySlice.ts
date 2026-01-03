import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

interface CancellationPolicyState {
  policies: string[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: CancellationPolicyState = {
  policies: [],
  ui: {
    loading: false,
    error: null,
  },
}

// Fetch cancellation policy by content ID
export const fetchCancellationPolicy = createAsyncThunk(
  'cancellationPolicy/fetch',
  async (contentId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`content/${contentId}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch cancellation policy')
      const data = await res.json()
      // Convert array or string to array
      const policies = Array.isArray(data.cancellationPolicy)
        ? data.cancellationPolicy
        : data.cancellationPolicy
        ? data.cancellationPolicy.split('\n').filter((p: string) => p.trim() !== '')
        : []
      return policies
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Update cancellation policy
export const updateCancellationPolicy = createAsyncThunk(
    'cancellationPolicy/update',
    async ({ contentId, policies }: { contentId: string; policies: string[] }, { rejectWithValue }) => {
      try {
        const res = await fetch(getApiUrl(`content/${contentId}/cancellation-policy`), {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ policies }),
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
          throw new Error(errorData.message || 'Failed to update cancellation policy')
        }
        
        const data = await res.json()
        
        // Return policies from response
        return Array.isArray(data.cancellationPolicy)
          ? data.cancellationPolicy
          : data.cancellationPolicy
          ? data.cancellationPolicy.split('\n').filter((p: string) => p.trim() !== '')
          : []
      } catch (err) {
        return rejectWithValue((err as Error).message)
      }
    }
  )
  const cancellationPolicySlice = createSlice({
  name: 'cancellationPolicy',
  initialState,
  reducers: {
    setPolicies: (state, action) => {
      state.policies = action.payload
    },
    clearPolicies: (state) => {
      state.policies = []
      state.ui.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCancellationPolicy.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCancellationPolicy.fulfilled, (state, action) => {
        state.ui.loading = false
        state.policies = action.payload
      })
      .addCase(fetchCancellationPolicy.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      // Update
      .addCase(updateCancellationPolicy.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateCancellationPolicy.fulfilled, (state, action) => {
        state.ui.loading = false
        state.policies = action.payload
      })
      .addCase(updateCancellationPolicy.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export const { setPolicies, clearPolicies } = cancellationPolicySlice.actions
export default cancellationPolicySlice.reducer