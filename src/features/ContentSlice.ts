import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Content {
  id: string
  offerName: string
  categoryName: string
  expiredDate: string
  status: 'active' | 'inactive'
  imageUrl?: string
  images?: string[]
  headlines?: string
  termsCondition?: string
  cancellationPolicy?: string | string[]
  description?: string
  discountPercentage?: number
  discountAmount?: number
  applicableCategories?: string[]
  applicableLocations?: string[]
  clicks?: number
}

interface ContentState {
  contents: Content[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: ContentState = {
  contents: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapContent = (content: any): Content => ({
  id: content._id || content.id,
  offerName: content.offerName || '',
  categoryName: content.categoryName || '',
  expiredDate: content.expiredDate || new Date().toISOString(),
  status: content.status || 'active',
  imageUrl: content.imageUrl,
  images: content.images || [],
  headlines: content.headlines,
  termsCondition: content.termsCondition,
  cancellationPolicy: Array.isArray(content.cancellationPolicy) 
    ? content.cancellationPolicy 
    : (content.cancellationPolicy || ''),
  description: content.description,
  discountPercentage: content.discountPercentage,
  discountAmount: content.discountAmount,
  applicableCategories: content.applicableCategories || [],
  applicableLocations: content.applicableLocations || [],
  clicks: content.clicks || 0,
})

export const fetchContents = createAsyncThunk(
  'content/fetchContents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('content'), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch contents')
      const data = await res.json()
      return data.map(mapContent)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createContent = createAsyncThunk(
  'content/createContent',
  async (content: Omit<Content, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('content'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error('Failed to create content')
      const data = await res.json()
      return mapContent(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`content/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch content')
      const data = await res.json()
      return mapContent(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateContentById = createAsyncThunk(
  'content/updateContentById',
  async ({ id, data }: { id: string; data: Partial<Content> }, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`content/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update content')
      const responseData = await res.json()
      return mapContent(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteContentById = createAsyncThunk(
  'content/deleteContentById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid content ID')
      }
      const res = await fetch(getApiUrl(`content/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete content')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.ui.loading = false
        state.contents = action.payload
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createContent.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.ui.loading = false
        state.contents.push(action.payload)
      })
      .addCase(createContent.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchContentById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.contents.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.contents[idx] = action.payload
        } else {
          state.contents.push(action.payload)
        }
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateContentById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateContentById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.contents.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.contents[idx] = action.payload
        }
      })
      .addCase(updateContentById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteContentById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteContentById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.contents = state.contents.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteContentById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default contentSlice.reducer