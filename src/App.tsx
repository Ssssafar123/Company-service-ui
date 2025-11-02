import React from 'react'
import { Routes , Route } from 'react-router-dom'
import TestForm from './pages/TestForm.js'
import Test from './pages/Test.js'
import Test2 from './pages/Test2.js'
import TableTest from './pages/TableTest.js'
import Layout from './Layout.js'
import ItineraryPage from './pages/Dashboard/Itinerary'
import AddNewItinerary from './modules/Itinerary/AddNewItinerary'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<Test/>} />
        <Route path='test2' element={<Test2/>} />
        <Route path='test-form' element={<TestForm/>} />
        <Route path='table' element={<TableTest/>} />
        <Route path='/itinerary' element={<ItineraryPage />} />
        <Route path='add-itinerary' element={<AddNewItinerary />} />
        </Route>
      </Routes>
      
    </div>
  )
}

export default App
