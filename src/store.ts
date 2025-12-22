import { configureStore } from '@reduxjs/toolkit'
import bookingReducer from './features/BookingSlice'
import itineraryReducer from './features/ItinerarySlice'

// Website module
import categoryReducer from './features/CategorySlice'
import locationReducer from './features/LocationSlice'
import reviewReducer from './features/ReviewSlice'
import contentReducer from './features/ContentSlice'

// Leads module
import leadReducer from './features/LeadSlice'
import customizeLeadReducer from './features/CustomizeLeadSlice'

// Sales module
import invoiceReducer from './features/InvoiceSlice'
import paymentReducer from './features/PaymentSlice'
import ledgerReducer from './features/LedgerSlice'

// Library module
import hotelReducer from './features/HotelSlice'
import activityReducer from './features/ActivitySlice'
import transportReducer from './features/TransportSlice'
import coordinatorReducer from './features/CoordinatorSlice'
import localSupportReducer from './features/LocalSupportSlice'

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    itinerary: itineraryReducer,
    
    // Website
    category: categoryReducer,
    location: locationReducer,
    review: reviewReducer,
    content: contentReducer,
    
    // Leads
    lead: leadReducer,
    customizeLead: customizeLeadReducer,
    
    // Sales
    invoice: invoiceReducer,
    payment: paymentReducer,
    ledger: ledgerReducer,
    
    // Library
    hotel: hotelReducer,
    activity: activityReducer,
    transport: transportReducer,
    coordinator: coordinatorReducer,
    localSupport: localSupportReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch