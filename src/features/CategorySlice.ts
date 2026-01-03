import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

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
      const res = await fetch(getApiUrl('category'), {
        credentials: 'include',
      })
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
  async (category: Omit<Category, 'id'> & { imageFile?: File, featureImageFiles?: File[] }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      
      // Add basic fields
      formData.append('name', category.name)
      formData.append('status', category.status)
      if (category.short_description) formData.append('short_description', category.short_description)
      if (category.long_description) formData.append('long_description', category.long_description)
      if (category.order) formData.append('order', category.order.toString())
      
      // Add itineraries as JSON
      if (category.itineraries && category.itineraries.length > 0) {
        formData.append('itineraries', JSON.stringify(category.itineraries))
      }
      
      // Add SEO fields as JSON
      if (category.seo_fields) {
        formData.append('seo_fields', JSON.stringify(category.seo_fields))
      }
      
      // Add image file if present
      if (category.imageFile) {
        formData.append('image', category.imageFile)
      }
      
      // Add feature image files if present
      if (category.featureImageFiles && category.featureImageFiles.length > 0) {
        category.featureImageFiles.forEach((file) => {
          formData.append('feature_images', file)
        })
      }
      
      const res = await fetch(getApiUrl('category'), {
        method: 'POST',
        credentials: 'include',
        body: formData,
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
      const res = await fetch(getApiUrl(`category/${id}`), {
        credentials: 'include',
      })
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
  async ({ id, data }: { id: string; data: Partial<Category> & { imageFile?: File, featureImageFiles?: File[] } }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      
      // Add basic fields if present
      if (data.name) formData.append('name', data.name)
      if (data.status) formData.append('status', data.status)
      if (data.short_description !== undefined) formData.append('short_description', data.short_description)
      if (data.long_description !== undefined) formData.append('long_description', data.long_description)
      if (data.order !== undefined) formData.append('order', data.order.toString())
      
      // Add itineraries as JSON
      if (data.itineraries !== undefined) {
        formData.append('itineraries', JSON.stringify(data.itineraries))
      }
      
      // Add SEO fields as JSON
      if (data.seo_fields !== undefined) {
        formData.append('seo_fields', JSON.stringify(data.seo_fields))
      }
      
      // Add image file if present
      if (data.imageFile) {
        formData.append('image', data.imageFile)
      }
      
      // Add feature image files if present
      if (data.featureImageFiles && data.featureImageFiles.length > 0) {
        data.featureImageFiles.forEach((file) => {
          formData.append('feature_images', file)
        })
      }
      
      const res = await fetch(getApiUrl(`category/${id}`), {
        method: 'PUT',
        credentials: 'include',
        body: formData,
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
      const res = await fetch(getApiUrl(`category/${id}`), {
        method: 'DELETE',
        credentials: 'include',
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