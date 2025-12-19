import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface SEOFields {
  index_status?: 'index' | 'notindex'
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  author?: string
}

export interface Category {
  id: string
  name: string
  image: string
  feature_images?: string[]
  short_description?: string
  long_description?: string
  tripCount?: number
  order?: number
  status: 'active' | 'inactive'           // <-- add this
  seo_fields?: SEOFields                  // <-- add this
  itineraries?: string[]                  // <-- add this
}

interface CategoryState {
  categories: Category[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: CategoryState = {
  categories: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapCategory = (category: any): Category => ({
  id: category._id || category.id,
  name: category.name || '',
  image: category.image || '',
  feature_images: category.feature_images || [],
  short_description: category.short_description,
  long_description: category.long_description,
  tripCount: category.tripCount || 0,
  order: category.order || 0,
  status: category.status || 'active',
  seo_fields: category.seo_fields,
  itineraries: category.itineraries || [],
})

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/category')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      return data.map(mapCategory)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (category: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })
      if (!res.ok) throw new Error('Failed to create category')
      const data = await res.json()
      return mapCategory(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/category/${id}`)
      if (!res.ok) throw new Error('Failed to fetch category')
      const data = await res.json()
      return mapCategory(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateCategoryById = createAsyncThunk(
  'category/updateCategoryById',
  async ({ id, data }: { id: string; data: Partial<Category> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/category/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update category')
      const responseData = await res.json()
      return mapCategory(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteCategoryById = createAsyncThunk(
  'category/deleteCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid category ID')
      }
      const res = await fetch(`http://localhost:8000/api/category/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete category')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.ui.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createCategory.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.ui.loading = false
        state.categories.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.categories.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.categories[idx] = action.payload
        } else {
          state.categories.push(action.payload)
        }
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateCategoryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateCategoryById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.categories.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) {
          state.categories[idx] = action.payload
        }
      })
      .addCase(updateCategoryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteCategoryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteCategoryById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.categories = state.categories.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCategoryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default categorySlice.reducer