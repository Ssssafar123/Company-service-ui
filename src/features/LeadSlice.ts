import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Lead {
  id: string
  name: string
  badgeType: 'instalink' | 'website' | 'phone' | 'walkin' | 'referral'
  leadId: string
  time: string
  phone: string
  email?: string
  destination?: string
  packageCode?: string
  itineraryId?: string
  remarks?: string
  savedRemarks?: string[]
  status: 'Hot' | 'Warm' | 'Cold' | 'Lost'
  contacted: 'New Enquiry' | 'Call Not Picked' | 'Contacted' | 'Qualified' | 'Plan & Quote Sent' | 'In Pipeline' | 'Negotiating' | 'Awaiting Payment' | 'Booked' | 'Lost & Closed' | 'Future Prospect'
  assignedTo: string
  reminder?: string
  estimatedBudget?: number
  preferredTravelDate?: string
  numberOfTravelers?: number
  source?: string
  notes?: string
}

interface PaginationData {
  data: Lead[]
  page: number
  limit: number
  totalPages: number
  totalRecords: number
}

interface LeadState {
  leads: Lead[]
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

const initialState: LeadState = {
  leads: [],
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

// Helper function to map _id to id
const mapLead = (lead: any): Lead => ({
  id: lead._id || lead.id,
  name: lead.name || '',
  badgeType: lead.badgeType || 'instalink',
  leadId: lead.leadId || '',
  time: lead.time || new Date().toISOString(),
  phone: lead.phone || '',
  email: lead.email,
  destination: lead.destination,
  packageCode: lead.packageCode,
  itineraryId: lead.itineraryId,
  remarks: lead.remarks,
  savedRemarks: lead.savedRemarks || [],
  status: lead.status || 'Warm',
  contacted: lead.contacted || 'New Enquiry',
  assignedTo: lead.assignedTo || '',
  reminder: lead.reminder,
  estimatedBudget: lead.estimatedBudget,
  preferredTravelDate: lead.preferredTravelDate,
  numberOfTravelers: lead.numberOfTravelers,
  source: lead.source,
  notes: lead.notes,
})

// Fetch all leads
export const fetchLeads = createAsyncThunk(
  'lead/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/lead', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch leads')
      const data = await res.json()
      return data.map(mapLead)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch leads by page
export const fetchLeadsByPage = createAsyncThunk(
  'lead/fetchLeadsByPage',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/lead/paginate?page=${page}&limit=${limit}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch leads')
      const response = await res.json()
      return {
        data: response.data.map(mapLead),
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

// Create lead
export const createLead = createAsyncThunk(
  'lead/createLead',
  async (lead: Omit<Lead, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/lead', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
      if (!res.ok) throw new Error('Failed to create lead')
      const data = await res.json()
      return mapLead(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch lead by ID
export const fetchLeadById = createAsyncThunk(
  'lead/fetchLeadById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/lead/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch lead')
      const data = await res.json()
      return mapLead(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Update lead by ID
export const updateLeadById = createAsyncThunk(
  'lead/updateLeadById',
  async ({ id, data }: { id: string; data: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/lead/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update lead')
      const responseData = await res.json()
      return mapLead(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Delete lead by ID
export const deleteLeadById = createAsyncThunk(
  'lead/deleteLeadById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid lead ID')
      }
      const res = await fetch(`http://localhost:8000/api/lead/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete lead')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all leads
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

      // Fetch leads by page
      .addCase(fetchLeadsByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLeadsByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.leads = action.payload.data
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords
        }
      })
      .addCase(fetchLeadsByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Create lead
      .addCase(createLead.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.ui.loading = false
        state.leads.push(action.payload)
        state.pagination.totalRecords += 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(createLead.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch lead by ID
      .addCase(fetchLeadById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.leads.findIndex(l => l.id === action.payload.id)
        if (idx !== -1) {
          state.leads[idx] = action.payload
        } else {
          state.leads.push(action.payload)
        }
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Update lead by ID
      .addCase(updateLeadById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateLeadById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.leads.findIndex(l => l.id === action.payload.id)
        if (idx !== -1) {
          state.leads[idx] = action.payload
        }
      })
      .addCase(updateLeadById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Delete lead by ID
      .addCase(deleteLeadById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteLeadById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.leads = state.leads.filter(l => l.id !== action.payload)
        state.pagination.totalRecords -= 1
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit)
      })
      .addCase(deleteLeadById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  }
})

export default leadSlice.reducer