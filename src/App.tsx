import React from 'react'
import { Routes , Route } from 'react-router-dom'
import TestForm from './pages/TestForm.js'
import Test from './pages/Test.js'
import TableTest from './pages/TableTest.js'
import Login from './pages/Login.js'
import ItineraryPage from './pages/Dashboard/Itinerary'
import CategoryPage from './pages/Dashboard/Category'
import Layout from './pages/Dashboard/Layout.js'
import AddNewItinerary from './modules/Itinerary/AddNewItinerary'
import AddCategory from './modules/Category/AddCategory'
import Dashboard from './pages/Dashboard/Dashboard.js'
import Leads from './modules/Leads/Leads'
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
        <Route path='leads' element={<Leads />} />
        <Route path='add-itinerary' element={<AddNewItinerary />} />
        <Route path='edit-itinerary' element={<AddNewItinerary />} /> 
        <Route path='add-category' element={<AddCategory />} />
        <Route path='edit-category' element={<AddCategory />} />

        </Route>
        
      </Routes>
      
    </div>
  )
}

export default App
