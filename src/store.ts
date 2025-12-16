import { configureStore } from '@reduxjs/toolkit'
import bookingReducer from './features/BookingSlice'
import itineraryReducer from './features/ItinerarySlice'

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
	itinerary : itineraryReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch