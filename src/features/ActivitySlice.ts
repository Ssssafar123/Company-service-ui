import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface AgeRestriction {
  minAge?: number
  maxAge?: number
}

export interface Activity {
  id: string
  name: string
  location: string
  locationLink?: string // Added
  duration: number
  price: number
  shortDescription?: string
  fullDescription?: string
  category?: 'adventure' | 'sightseeing' | 'water_sports' | 'cultural' | 'wildlife' | 'other'
  images?: string[] // Updated
  videos?: string[] // Added
  inclusions?: string[]
  exclusions?: string[]
  ageRestriction?: AgeRestriction
  difficultyLevel?: 'easy' | 'medium' | 'hard' | 'extreme'
  status: 'active' | 'inactive'
}

interface ActivityState {
  activities: Activity[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: ActivityState = {
  activities: [],
  ui: {
    loading: false,
    error: null,
  },
}

const mapActivity = (activity: any): Activity => ({
  id: activity._id || activity.id,
  name: activity.name || '',
  location: activity.location || '',
  locationLink: activity.locationLink, // Added
  duration: activity.duration || 0,
  price: activity.price || 0,
  shortDescription: activity.shortDescription,
  fullDescription: activity.fullDescription,
  category: activity.category,
  images: activity.images || [],
  videos: activity.videos || [], // Added
  inclusions: activity.inclusions || [],
  exclusions: activity.exclusions || [],
  ageRestriction: activity.ageRestriction,
  difficultyLevel: activity.difficultyLevel,
  status: activity.status || 'active',
})

export const fetchActivities = createAsyncThunk(
  'activity/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('activity') , {method : "GET" , credentials : "include"})
      if (!res.ok) throw new Error('Failed to fetch activities')
      const data = await res.json()
      return data.map(mapActivity)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const createActivity = createAsyncThunk(
  'activity/createActivity',
  async (data: { 
    activity: Omit<Activity, 'id'>;
    imageFiles?: File[];
    videoFiles?: File[];
  }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      const { imageFiles, videoFiles, activity } = data;
      
      // Append all activity fields except images and videos
      Object.keys(activity).forEach(key => {
        const value = (activity as any)[key];
        if (key === 'images' || key === 'videos') {
          return; // Skip these - handle separately
        }
        
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      
      // Append image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // Append video files
      if (videoFiles && videoFiles.length > 0) {
        videoFiles.forEach((file) => {
          formData.append('videos', file);
        });
      }
      
      const res = await fetch(getApiUrl('activity'), {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to create activity' }))
        throw new Error(errorData.message || 'Failed to create activity')
      }
      
      const data_res = await res.json()
      return mapActivity(data_res)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchActivityById = createAsyncThunk(
  'activity/fetchActivityById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`activity/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch activity')
      const data = await res.json()
      return mapActivity(data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const updateActivityById = createAsyncThunk(
  'activity/updateActivityById',
  async ({ 
    id, 
    data,
    imageFiles,
    videoFiles,
  }: { 
    id: string
    data: Partial<Activity>
    imageFiles?: File[]
    videoFiles?: File[]
  }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append activity fields except images and videos
      Object.keys(data).forEach(key => {
        const value = (data as any)[key];
        if (key === 'images' || key === 'videos') {
          return; // Skip these - handle separately
        }
        
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Append new image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // Append new video files
      if (videoFiles && videoFiles.length > 0) {
        videoFiles.forEach((file) => {
          formData.append('videos', file);
        });
      }
      
      const res = await fetch(getApiUrl(`activity/${id}`), {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update activity' }))
        throw new Error(errorData.message || 'Failed to update activity')
      }
      
      const responseData = await res.json()
      return mapActivity(responseData)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const deleteActivityById = createAsyncThunk(
  'activity/deleteActivityById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid activity ID')
      }
      const res = await fetch(getApiUrl(`activity/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete activity')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.ui.loading = false
        state.activities = action.payload
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(createActivity.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.ui.loading = false
        state.activities.push(action.payload)
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(fetchActivityById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.activities.findIndex((a) => a.id === action.payload.id)
        if (idx !== -1) {
          state.activities[idx] = action.payload
        } else {
          state.activities.push(action.payload)
        }
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(updateActivityById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateActivityById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.activities.findIndex((a) => a.id === action.payload.id)
        if (idx !== -1) {
          state.activities[idx] = action.payload
        }
      })
      .addCase(updateActivityById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
      .addCase(deleteActivityById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteActivityById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.activities = state.activities.filter((a) => a.id !== action.payload)
      })
      .addCase(deleteActivityById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default activitySlice.reducer