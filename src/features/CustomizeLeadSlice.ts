import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface CustomField {
  fieldName: string
  fieldValue: any
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'select'
}

export interface CustomizeLead {
  id: string
  leadId: string
  customFields?: CustomField[]
  customStatus?: string
  customTags?: string[]
  priority: 'high' | 'medium' | 'low'
  followUpDate?: string
  conversionProbability?: number
  customNotes?: string
}

interface CustomizeLeadState {
  customizeLeads: CustomizeLead[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: CustomizeLeadState = {
  customizeLeads: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapCustomizeLead = (customizeLead: any): CustomizeLead => ({
  id: customizeLead._id || customizeLead.id,
  leadId: customizeLead.leadId || '',
  customFields: customizeLead.customFields || [],
  customStatus: customizeLead.customStatus,
  customTags: customizeLead.customTags || [],
  priority: customizeLead.priority || 'medium',
  followUpDate: customizeLead.followUpDate,
  conversionProbability: customizeLead.conversionProbability,
  customNotes: customizeLead.customNotes,
})

export const fetchCustomizeLeads = createAsyncThunk(
  'customizeLead/fetchCustomizeLeads',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/customizelead')
      if (!res.ok) throw new Error('Failed to fetch customize leads')
      const data = await res.json()
      return data.map(mapCustomizeLead)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createCustomizeLead = createAsyncThunk(
  'customizeLead/createCustomizeLead',
  async (customizeLead: Omit<CustomizeLead, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/customizelead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customizeLead),
      })
      if (!res.ok) throw new Error('Failed to create customize lead')
      const data = await res.json()
      return mapCustomizeLead(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchCustomizeLeadById = createAsyncThunk(
  'customizeLead/fetchCustomizeLeadById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/customizelead/${id}`)
      if (!res.ok) throw new Error('Failed to fetch customize lead')
      const data = await res.json()
      return mapCustomizeLead(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateCustomizeLeadById = createAsyncThunk(
  'customizeLead/updateCustomizeLeadById',
  async ({ id, data }: { id: string; data: Partial<CustomizeLead> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/customizelead/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update customize lead')
      const responseData = await res.json()
      return mapCustomizeLead(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteCustomizeLeadById = createAsyncThunk(
  'customizeLead/deleteCustomizeLeadById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid customize lead ID')
      }
      const res = await fetch(`http://localhost:8000/api/customizelead/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete customize lead')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const customizeLeadSlice = createSlice({
  name: 'customizeLead',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomizeLeads.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomizeLeads.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customizeLeads = action.payload
      })
      .addCase(fetchCustomizeLeads.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createCustomizeLead.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createCustomizeLead.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customizeLeads.push(action.payload)
      })
      .addCase(createCustomizeLead.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchCustomizeLeadById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomizeLeadById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.customizeLeads.findIndex((cl) => cl.id === action.payload.id)
        if (idx !== -1) {
          state.customizeLeads[idx] = action.payload
        } else {
          state.customizeLeads.push(action.payload)
        }
      })
      .addCase(fetchCustomizeLeadById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateCustomizeLeadById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateCustomizeLeadById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.customizeLeads.findIndex((cl) => cl.id === action.payload.id)
        if (idx !== -1) {
          state.customizeLeads[idx] = action.payload
        }
      })
      .addCase(updateCustomizeLeadById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteCustomizeLeadById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteCustomizeLeadById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customizeLeads = state.customizeLeads.filter((cl) => cl.id !== action.payload)
      })
      .addCase(deleteCustomizeLeadById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default customizeLeadSlice.reducer