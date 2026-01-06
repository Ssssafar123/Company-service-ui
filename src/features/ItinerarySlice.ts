import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApiUrl } from '../config/api'

export interface Itinerary {
  id: string
  name: string // Changed from 'title'
  city: string // Changed from 'destination'
  description: string
  duration: string // Your backend sends "5D 4N"
  price: number
  startDate: string
  endDate: string
  maxTravelers?: number
  availableSeats?: number
  inclusions: string[]
  exclusions: string[]
  highlights?: string[]
  status: 'active' | 'inactive' | 'Active' | 'Inactive' | 'draft'
  imageUrl?: string
  priceDisplay?: string
  trending?: string
}

interface ItineraryState {
  itineraries: Itinerary[]
  ui: {
    loading: boolean
    error: string | null
  }
}

const initialState: ItineraryState = {
  itineraries: [],
  ui: {
    loading: false,
    error: null,
  },
}

// Helper function to calculate starting price from packages
const calculateStartingPrice = (itinerary: any): number => {
  // First, check if price is set and valid
  if (itinerary.price && typeof itinerary.price === 'number' && itinerary.price > 0) {
    return itinerary.price;
  }
  
  // Calculate from basePackages if available
  if (itinerary.packages && itinerary.packages.basePackages && Array.isArray(itinerary.packages.basePackages)) {
    const basePackages = itinerary.packages.basePackages;
    if (basePackages.length > 0) {
      // Find minimum discounted_price from basePackages
      const prices = basePackages
        .map((pkg: any) => {
          // Check for discounted_price first, then price
          const discountedPrice = pkg.discounted_price || pkg.price || 0;
          return typeof discountedPrice === 'number' && discountedPrice > 0 ? discountedPrice : null;
        })
        .filter((price: number | null): price is number => price !== null);
      
      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }
  }
  
  // Fallback to 0 if no price found
  return 0;
};

// Helper function to map _id to id
const mapItinerary = (itinerary: any): Itinerary => {
  // Calculate starting price from packages if price is not set
  const calculatedPrice = calculateStartingPrice(itinerary);
  
  return {
    id: itinerary._id || itinerary.id,
    name: itinerary.name || '',
    city: itinerary.city || '',
    description: itinerary.description || '',
    duration: itinerary.duration || '',
    price: calculatedPrice, // Use calculated price
    startDate: itinerary.startDate || '',
    endDate: itinerary.endDate || '',
    maxTravelers: itinerary.maxTravelers || 0,
    availableSeats: itinerary.availableSeats || 0,
    inclusions: itinerary.inclusions || [],
    exclusions: itinerary.exclusions || [],
    highlights: itinerary.highlights || [],
    status: itinerary.status || 'inactive',
    imageUrl: itinerary.brochureBanner || (itinerary.images && itinerary.images[0]) || '',
    priceDisplay: itinerary.priceDisplay || (calculatedPrice > 0 ? `₹${calculatedPrice.toLocaleString('en-IN')}` : '₹0'),
    trending: itinerary.trending || 'No',
  }
}

// Fetch all itineraries
export const fetchItineraries = createAsyncThunk(
  'itinerary/fetchItineraries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl('itinerary'), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch itineraries')
      const data = await res.json()
      return data.map(mapItinerary)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Create new itinerary
export const createItinerary = createAsyncThunk(
  'itinerary/createItinerary',
  async (data: { 
	payload: any; 
	imageFiles?: File[]; 
	brochureBannerFile?: File;
	hotelImageFiles?: { hotelIndex: number, imageIndex: number, file: File }[];
	dayImageFiles?: { dayIndex: number, imageIndex: number, file: File }[];
	mealImageFiles?: { dayIndex: number, mealName: string, imageIndex: number, file: File }[];
	stayImageFiles?: { dayIndex: number, stayName: string, imageIndex: number, file: File }[];
}, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all payload fields to FormData
      Object.keys(data.payload).forEach(key => {
        const value = data.payload[key];
        
        // Skip image fields if we have files to upload - otherwise include URLs
        if (key === 'images' && data.imageFiles && data.imageFiles.length > 0) {
          return; // Skip URLs if we have files
        }
        if (key === 'brochureBanner' && data.brochureBannerFile) {
          return; // Skip URL if we have file
        }
        
        // Handle arrays and objects - stringify them
        if (Array.isArray(value)) {
          // For arrays, append each item or stringify if complex
          if (value.length > 0 && typeof value[0] === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      
      // Append image files
      if (data.imageFiles && data.imageFiles.length > 0) {
        data.imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // Append brochure banner file or URL
      if (data.brochureBannerFile) {
        formData.append('brochureBanner', data.brochureBannerFile);
      } else if (data.payload.brochureBanner && typeof data.payload.brochureBanner === 'string' && data.payload.brochureBanner.trim() !== '') {
        // If no file but URL string exists, append the URL
        formData.append('brochureBanner', data.payload.brochureBanner);
      }

      // Append hotel images
if (data.hotelImageFiles && data.hotelImageFiles.length > 0) {
	data.hotelImageFiles.forEach(({ hotelIndex, imageIndex, file }) => {
		formData.append(`hotelImages[${hotelIndex}][${imageIndex}]`, file);
	});
}

// Append day images
if (data.dayImageFiles && data.dayImageFiles.length > 0) {
	data.dayImageFiles.forEach(({ dayIndex, imageIndex, file }) => {
		formData.append(`dayImages[${dayIndex}][${imageIndex}]`, file);
	});
}

// Append meal images
if (data.mealImageFiles && data.mealImageFiles.length > 0) {
	data.mealImageFiles.forEach(({ dayIndex, mealName, imageIndex, file }) => {
		formData.append(`mealImages[${dayIndex}][${mealName}][${imageIndex}]`, file);
	});
}

// Append stay images
if (data.stayImageFiles && data.stayImageFiles.length > 0) {
	data.stayImageFiles.forEach(({ dayIndex, stayName, imageIndex, file }) => {
		formData.append(`stayImages[${dayIndex}][${stayName}][${imageIndex}]`, file);
	});
}
      
      const res = await fetch(getApiUrl('itinerary'), {
        method: 'POST',
        credentials: 'include',
        // DON'T set Content-Type header - browser will set it with boundary
        body: formData,
      })
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create itinerary');
      }
      const responseData = await res.json();
      return mapItinerary(responseData);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
)

// Fetch itinerary by ID - returns full data for editing
export const fetchItineraryById = createAsyncThunk(
  'itinerary/fetchItineraryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(getApiUrl(`itinerary/${id}`), {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch itinerary')
      const data = await res.json()
      // Return full data with id mapped for consistency
      return {
        ...data,
        id: data._id || data.id,
      }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

// Update itinerary by ID
export const updateItineraryById = createAsyncThunk(
  'itinerary/updateItineraryById',
 async ({ 
	id, 
	data, 
	imageFiles, 
	brochureBannerFile,
	hotelImageFiles,
	dayImageFiles,
	mealImageFiles,
	stayImageFiles
}: { 
	id: string; 
	data: Partial<Itinerary>;
	imageFiles?: File[];
	brochureBannerFile?: File;
	hotelImageFiles?: { hotelIndex: number, imageIndex: number, file: File }[];
	dayImageFiles?: { dayIndex: number, imageIndex: number, file: File }[];
	mealImageFiles?: { dayIndex: number, mealName: string, imageIndex: number, file: File }[];
	stayImageFiles?: { dayIndex: number, stayName: string, imageIndex: number, file: File }[];
}, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all data fields to FormData
      Object.keys(data).forEach(key => {
        const value = (data as any)[key];
        
        // Skip image fields - we'll handle them separately
        if (key === 'images' || key === 'brochureBanner') {
          return; // Skip these - handle separately below
        }
        
        // Handle arrays and objects - stringify them
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      
      // Append image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        // If no new files but existing URLs, append URLs
        data.images.forEach((url: string) => {
          formData.append('images', url);
        });
      }
      
      // Append brochure banner file or URL (handle separately to avoid duplicates)
      if (brochureBannerFile) {
        formData.append('brochureBanner', brochureBannerFile);
      } else if (data.brochureBanner && typeof data.brochureBanner === 'string' && data.brochureBanner.trim() !== '') {
        // If no file but URL string exists, append the URL
        formData.append('brochureBanner', data.brochureBanner);
      }

      // Append hotel images
      if (hotelImageFiles && hotelImageFiles.length > 0) {
        hotelImageFiles.forEach(({ hotelIndex, imageIndex, file }) => {
          formData.append(`hotelImages[${hotelIndex}][${imageIndex}]`, file);
        });
      }

      // Append day images
      if (dayImageFiles && dayImageFiles.length > 0) {
        dayImageFiles.forEach(({ dayIndex, imageIndex, file }) => {
          formData.append(`dayImages[${dayIndex}][${imageIndex}]`, file);
        });
      }

      // Append meal images
      if (mealImageFiles && mealImageFiles.length > 0) {
        mealImageFiles.forEach(({ dayIndex, mealName, imageIndex, file }) => {
          formData.append(`mealImages[${dayIndex}][${mealName}][${imageIndex}]`, file);
        });
      }

      // Append stay images
      if (stayImageFiles && stayImageFiles.length > 0) {
        stayImageFiles.forEach(({ dayIndex, stayName, imageIndex, file }) => {
          formData.append(`stayImages[${dayIndex}][${stayName}][${imageIndex}]`, file);
        });
      }
      
      const res = await fetch(getApiUrl(`itinerary/${id}`), {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update itinerary');
      }
      const responseData = await res.json();
      return mapItinerary(responseData);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
)

// Delete itinerary by ID
export const deleteItineraryById = createAsyncThunk(
  'itinerary/deleteItineraryById',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Invalid itinerary ID')
      }
      const res = await fetch(getApiUrl(`itinerary/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete itinerary')
      return id
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all itineraries
      .addCase(fetchItineraries.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchItineraries.fulfilled, (state, action) => {
        state.ui.loading = false
        state.itineraries = action.payload
      })
      .addCase(fetchItineraries.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Create itinerary
      .addCase(createItinerary.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(createItinerary.fulfilled, (state, action) => {
        state.ui.loading = false
        state.itineraries.push(action.payload)
      })
      .addCase(createItinerary.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Fetch itinerary by ID
      .addCase(fetchItineraryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(fetchItineraryById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.itineraries.findIndex((i) => i.id === action.payload.id)
        if (idx !== -1) {
          state.itineraries[idx] = action.payload
        } else {
          state.itineraries.push(action.payload)
        }
      })
      .addCase(fetchItineraryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Update itinerary by ID
      .addCase(updateItineraryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(updateItineraryById.fulfilled, (state, action) => {
        state.ui.loading = false
        const idx = state.itineraries.findIndex((i) => i.id === action.payload.id)
        if (idx !== -1) {
          state.itineraries[idx] = action.payload
        }
      })
      .addCase(updateItineraryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })

      // Delete itinerary by ID
      .addCase(deleteItineraryById.pending, (state) => {
        state.ui.loading = true
        state.ui.error = null
      })
      .addCase(deleteItineraryById.fulfilled, (state, action) => {
        state.ui.loading = false
        state.itineraries = state.itineraries.filter((i) => i.id !== action.payload)
      })
      .addCase(deleteItineraryById.rejected, (state, action) => {
        state.ui.loading = false
        state.ui.error = action.payload as string
      })
  },
})

export default itinerarySlice.reducer