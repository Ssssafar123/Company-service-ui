import React from 'react'
import { Routes , Route } from 'react-router-dom'
import TestForm from './pages/TestForm.js'
import Test from './pages/Home.js'
import TableTest from './pages/TableTest.js'
import Login from './pages/Login.js'
import ItineraryPage from './pages/Dashboard/Itinerary'
import CategoryPage from './pages/Dashboard/Category'
import Layout from './pages/Dashboard/Layout.js'
import AddNewItinerary from './modules/Itinerary/AddNewItinerary'
import AddCategory from './modules/Category/AddCategory'
import Dashboard from './pages/Dashboard/Dashboard.js'
import Leads from './modules/Leads/Leads'
import LocationPage from './pages/Dashboard/Location'
import AddLocation from './modules/Location/AddLocation'
import CustomizeLeadsPage from './pages/Dashboard/CustomizeLeads'
import HotelPage from './pages/Dashboard/Hotel'
import TransportPage from './pages/Dashboard/Transport'
import LocalSupportPage from './pages/Dashboard/LocalSupport'
import CoordinatorPage from './pages/Dashboard/Coordinator'
import ActivitiesPage from './pages/Dashboard/Activities'
import ReviewPage from './pages/Dashboard/Review' 
import BookingsPage from './pages/Dashboard/Bookings'
import ContentPage from './pages/Dashboard/Content'
import PaymentPage from './pages/Dashboard/Payment.js'
import Invoice from './pages/Dashboard/Invoice.js'
import AddInvoice from './pages/Dashboard/AddInvoice.js'
import LedgerPage from './pages/Dashboard/Ledger'
const App = () => {
  return (
    <div>
      {/* <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<Test/>} />
        <Route path='test-form' element={<TestForm/>} />
        <Route path='table' element={<TableTest/>} />
        <Route path='itinerary' element={<ItineraryPage />} />
        <Route path='category' element={<CategoryPage />} />
        <Route path='add-itinerary' element={<AddNewItinerary />} />
        <Route path='edit-itinerary' element={<AddNewItinerary />} /> 
        <Route path='add-category' element={<AddCategory />} />
        <Route path='edit-category' element={<AddCategory />} />
        </Route>
      </Routes> */}

      <Routes>
        <Route path='/' element={<Test/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route path='/dashboard' element={<Layout/>} >

        <Route index element={<Dashboard/>} />
        <Route path='test-form' element={<TestForm/>} />
        <Route path='table' element={<TableTest/>} />
        <Route path='itinerary' element={<ItineraryPage />} />
        <Route path='category' element={<CategoryPage />} />
        <Route path='location' element={<LocationPage />} />
        <Route path='leads' element={<Leads />} />
        <Route path='customize-leads' element={<CustomizeLeadsPage />} />
        <Route path='library/hotel' element={<HotelPage />} />
        <Route path='library/transport' element={<TransportPage />} />
        <Route path='library/local-support' element={<LocalSupportPage />} />
        <Route path='library/coordinator' element={<CoordinatorPage />} />
        <Route path='library/activities' element={<ActivitiesPage />} />
        <Route path='review' element={<ReviewPage />} /> 
        <Route path='add-itinerary' element={<AddNewItinerary />} />
        <Route path='edit-itinerary' element={<AddNewItinerary />} /> 
        <Route path='add-category' element={<AddCategory />} />
        <Route path='edit-category' element={<AddCategory />} />
        <Route path='add-location' element={<AddLocation />} />  
        <Route path='edit-location' element={<AddLocation />} />
        <Route path='bookings' element={<BookingsPage />} />
        <Route path='content' element={<ContentPage />} />
        <Route path='invoice' element={<Invoice />} />
        <Route path='payment' element={<PaymentPage />} />
        <Route path='addInvoice' element={<AddInvoice/>}/>
        <Route path='ledger' element={<LedgerPage />} />


        </Route>
        
      </Routes>
      
    </div>
  )
}

export default App
