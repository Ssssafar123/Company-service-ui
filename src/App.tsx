import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Test from './pages/test.js'
import Test2 from './pages/Test2.js'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Test/>} />
        <Route path='/test2' element={<Test2/>} />
      </Routes>
    </div>
  )
}

export default App
