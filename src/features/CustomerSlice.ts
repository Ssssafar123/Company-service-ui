import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Customer {
  id: string
  name: string
  base_city: string
  age: number
  phone: number
  email: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  instagram?: string
  refer?: string
  starting_point: string
  drop_point: string
  createdAt?: string
  updatedAt?: string
}

interface CustomerState {
  customers: Customer[]
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

const initialState: CustomerState = {
  customers: [],
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
const mapCustomer = (customer: any): Customer => {
  if (!customer || typeof customer !== 'object') {
    throw new Error('Invalid customer data')
  }
  return {
    id: customer._id || customer.id || '',
    name: customer.name || '',
    base_city: customer.base_city || '',
    age: customer.age || 0,
    phone: customer.phone || 0,
    email: customer.email || '',
    gender: customer.gender || 'OTHER',
    instagram: customer.instagram,
    refer: customer.refer,
    starting_point: customer.starting_point || '',
    drop_point: customer.drop_point || '',
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  }
}

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('customer'), {
        credentials: 'include',
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to fetch customers')
      }
      const responseData = await res.json()
      
      // Handle different response formats
      // Backend returns: { success: true, data: [...] } or array directly
      let customers = []
      if (Array.isArray(responseData)) {
        customers = responseData
      } else if (responseData.data && Array.isArray(responseData.data)) {
        customers = responseData.data
      } else if (responseData.customers && Array.isArray(responseData.customers)) {
        customers = responseData.customers
      }
      
      // Safely map customers - filter out null/undefined and invalid entries
      const mappedCustomers = Array.isArray(customers)
        ? customers
            .filter(c => c != null && typeof c === 'object' && (c._id || c.id))
            .map(c => {
              try {
                return mapCustomer(c)
              } catch (err) {
                console.error('Error mapping customer:', c, err)
                return null
              }
            })
            .filter(c => c != null) as Customer[]
        : []
      
      return mappedCustomers
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch customers by pagination
export const fetchCustomersByPage = createAsyncThunk(
  'customer/fetchCustomersByPage',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`customer/pagination?page=${page}&limit=${limit}`), {
        credentials: 'include',
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to fetch customers')
      }
      const responseData = await res.json()
      
      // Backend returns: { success: true, data: [...], page, limit, totalPages, totalRecords }
      // Handle different response formats
      let customers = []
      if (Array.isArray(responseData)) {
        customers = responseData
      } else if (responseData.data && Array.isArray(responseData.data)) {
        customers = responseData.data
      } else if (responseData.customers && Array.isArray(responseData.customers)) {
        customers = responseData.customers
      }
      
      // Safely map customers - filter out null/undefined and invalid entries
      const mappedCustomers = Array.isArray(customers) 
        ? customers
            .filter(c => c != null && typeof c === 'object' && (c._id || c.id))
            .map(c => {
              try {
                return mapCustomer(c)
              } catch (err) {
                console.error('Error mapping customer:', c, err)
                return null
              }
            })
            .filter(c => c != null) as Customer[]
        : []
      
      return {
        customers: mappedCustomers,
        pagination: {
          page: responseData.page || page,
          limit: responseData.limit || limit,
          totalPages: responseData.totalPages || Math.ceil((mappedCustomers.length || 0) / limit) || 1,
          totalRecords: responseData.totalRecords || mappedCustomers.length || 0,
        },
      }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch customer by booking ID
export const fetchCustomerByBookingId = createAsyncThunk(
  'customer/fetchCustomerByBookingId',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`customer/booking/${bookingId}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch customer')
      const data = await res.json()
      return mapCustomer(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch customer by email
export const fetchCustomerByEmail = createAsyncThunk(
  'customer/fetchCustomerByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`customer/email/${email}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch customer')
      const data = await res.json()
      return mapCustomer(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Fetch customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`customer/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch customer')
      const data = await res.json()
      return mapCustomer(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Create new customer
export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (customer: Omit<Customer, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('customer'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create customer')
      }
      const data = await res.json()
      return mapCustomer(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Update customer by ID
export const updateCustomerById = createAsyncThunk(
  'customer/updateCustomerById',
  async ({ id, data }: { id: string; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`customer/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to update customer')
      }
      const responseData = await res.json()
      return mapCustomer(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Delete customer by ID
export const deleteCustomerById = createAsyncThunk(
  'customer/deleteCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid customer ID')
      }
      const res = await fetch(getApiUrl(`customer/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete customer')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customers = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch customers by pagination
      .addCase(fetchCustomersByPage.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomersByPage.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customers = action.payload.customers
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCustomersByPage.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch customer by booking ID
      .addCase(fetchCustomerByBookingId.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomerByBookingId.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.customers.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.customers[idx] = action.payload
        } else {
          state.customers.push(action.payload)
        }
      })
      .addCase(fetchCustomerByBookingId.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch customer by email
      .addCase(fetchCustomerByEmail.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomerByEmail.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.customers.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.customers[idx] = action.payload
        } else {
          state.customers.push(action.payload)
        }
      })
      .addCase(fetchCustomerByEmail.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.customers.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.customers[idx] = action.payload
        } else {
          state.customers.push(action.payload)
        }
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customers.push(action.payload)
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Update customer by ID
      .addCase(updateCustomerById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateCustomerById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.customers.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.customers[idx] = action.payload
        }
      })
      .addCase(updateCustomerById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Delete customer by ID
      .addCase(deleteCustomerById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteCustomerById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.customers = state.customers.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCustomerById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default customerSlice.reducer
