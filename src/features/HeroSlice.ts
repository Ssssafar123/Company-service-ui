import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BACKEND_BASE_URL } from '../config/api'

export interface HeroSlide {
  id: string
  heroType?: string
  title: string
  description: string
  bgImage: string
  cards: string[]
}

interface HeroState {
  slides: HeroSlide[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: HeroState = {
  slides: [],
  ui: {
    loading: false,
    error: null,
  },
}

// Map API response to HeroSlide interface
const mapHeroSlide = (slide: any): HeroSlide => ({
  id: slide.id,                // ✅ ONLY UUID
  heroType: slide.heroType || '',
  title: slide.title || '',
  description: slide.description || '',
  bgImage: slide.bgImage || '',
  cards: slide.cards || [],
})


// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || ''
}

const API_BASE = BACKEND_BASE_URL

/* FETCH ALL HERO SLIDES */
export const fetchHeroSlides = createAsyncThunk(
  'hero/fetchHeroSlides',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      const res = await fetch(`${API_BASE}/api/hero-slides`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch hero slides')
      const data = await res.json()
      
      // Handle wrapped response format {success: true, data: [...]}
      if (data?.success && Array.isArray(data.data)) {
        return data.data.map(mapHeroSlide)
      }
      // Handle direct array format (fallback)
      if (Array.isArray(data)) {
        return data.map(mapHeroSlide)
      }
      // Handle single object (fallback)
      return [mapHeroSlide(data)]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)
/* CREATE SINGLE HERO SLIDE */
export const createHeroSlide = createAsyncThunk(
  'hero/createHeroSlide',
  async (slide: Omit<HeroSlide, 'id'>, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      const res = await fetch(`${API_BASE}/api/hero-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(slide),
      })
      if (!res.ok) throw new Error('Failed to create hero slide')
      const data = await res.json()
      return mapHeroSlide(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

/* FETCH SINGLE HERO SLIDE BY ID */
export const fetchHeroSlideById = createAsyncThunk(
  'hero/fetchHeroSlideById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      const res = await fetch(`${API_BASE}/api/hero-slides/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch hero slide')
      const data = await res.json()
      return mapHeroSlide(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

/* UPDATE HERO SLIDE BY ID */
export const updateHeroSlideById = createAsyncThunk(
  'hero/updateHeroSlideById',
  async ({ id, data }: { id: string; data: Partial<HeroSlide> }, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      const res = await fetch(`${API_BASE}/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update hero slide')
      const responseData = await res.json()
      return mapHeroSlide(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

/* DELETE HERO SLIDE BY ID */
export const deleteHeroSlideById = createAsyncThunk(
  'hero/deleteHeroSlideById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid hero slide ID')
      }
      const token = getAuthToken()
      const res = await fetch(`${API_BASE}/api/hero-slides/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete hero slide')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

/* SAVE MULTIPLE HERO SLIDES (batch) */
/* SAVE MULTIPLE HERO SLIDES (batch) */
export const saveHeroSlides = createAsyncThunk(
  'hero/saveHeroSlides',
  async (slides: HeroSlide[], { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      const res = await fetch(`${API_BASE}/api/hero-slides/bulk/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(slides),
      })
      if (!res.ok) throw new Error('Failed to save hero slides')
      const data = await res.json()
      
      // Handle wrapped response format
      if (data?.success && Array.isArray(data.data)) {
        return data.data.map(mapHeroSlide)
      }
      // Handle direct array format (fallback)
      if (Array.isArray(data)) {
        return data.map(mapHeroSlide)
      }
      // Handle single object (fallback)
      return [mapHeroSlide(data)]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)
const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchHeroSlides.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.ui.loading = false
        state.slides = action.payload
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      // Create
      .addCase(createHeroSlide.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createHeroSlide.fulfilled, (state, action) => {
        state.ui.loading = false
        state.slides.push(action.payload)
      })
      .addCase(createHeroSlide.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      // Fetch by ID
      .addCase(fetchHeroSlideById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchHeroSlideById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.slides.findIndex((s) => s.id === action.payload.id)
        if (idx !== -1) {
          state.slides[idx] = action.payload
        } else {
          state.slides.push(action.payload)
        }
      })
      .addCase(fetchHeroSlideById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      // Update by ID
      .addCase(updateHeroSlideById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateHeroSlideById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.slides.findIndex((s) => s.id === action.payload.id)
        if (idx !== -1) {
          state.slides[idx] = action.payload
        }
      })
      .addCase(updateHeroSlideById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      // Delete by ID
      .addCase(deleteHeroSlideById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteHeroSlideById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.slides = state.slides.filter((s) => s.id !== action.payload)
      })
      .addCase(deleteHeroSlideById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      // Save batch
      .addCase(saveHeroSlides.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(saveHeroSlides.fulfilled, (state, action) => {
        state.ui.loading = false
        state.slides = action.payload
      })
      .addCase(saveHeroSlides.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default heroSlice.reducer