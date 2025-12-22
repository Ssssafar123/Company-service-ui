import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Review {
  id: string
  customerName: string
  rating: number
  reviewText: string
  date: string
  status: 'Approved' | 'Pending' | 'Rejected'
  packageName?: string
  packageCode?: string
  reviewerImageUrl?: string
  itineraryId?: string
  bookingId?: string
}

interface ReviewState {
  reviews: Review[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: ReviewState = {
  reviews: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapReview = (review: any): Review => ({
  id: review._id || review.id,
  customerName: review.customerName || '',
  rating: review.rating || 0,
  reviewText: review.reviewText || '',
  date: review.date || new Date().toISOString(),
  status: review.status || 'Pending',
  packageName: review.packageName,
  packageCode: review.packageCode,
  reviewerImageUrl: review.reviewerImageUrl,
  itineraryId: review.itineraryId,
  bookingId: review.bookingId,
})

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/review', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()
      return data.map(mapReview)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createReview = createAsyncThunk(
  'review/createReview',
  async (review: Omit<Review, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/review', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      })
      if (!res.ok) throw new Error('Failed to create review')
      const data = await res.json()
      return mapReview(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchReviewById = createAsyncThunk(
  'review/fetchReviewById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/review/${id}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch review')
      const data = await res.json()
      return mapReview(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateReviewById = createAsyncThunk(
  'review/updateReviewById',
  async ({ id, data }: { id: string; data: Partial<Review> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/api/review/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update review')
      const responseData = await res.json()
      return mapReview(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteReviewById = createAsyncThunk(
  'review/deleteReviewById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid review ID')
      }
      const res = await fetch(`http://localhost:8000/api/review/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete review')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.ui.loading = false
        state.reviews = action.payload
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createReview.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.ui.loading = false
        state.reviews.push(action.payload)
      })
      .addCase(createReview.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchReviewById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.reviews.findIndex((r) => r.id === action.payload.id)
        if (idx !== -1) {
          state.reviews[idx] = action.payload
        } else {
          state.reviews.push(action.payload)
        }
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateReviewById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateReviewById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.reviews.findIndex((r) => r.id === action.payload.id)
        if (idx !== -1) {
          state.reviews[idx] = action.payload
        }
      })
      .addCase(updateReviewById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteReviewById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteReviewById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.reviews = state.reviews.filter((r) => r.id !== action.payload)
      })
      .addCase(deleteReviewById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default reviewSlice.reducer