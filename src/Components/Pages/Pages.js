import React from 'react'
import { Route,Routes } from 'react-router-dom'
import StudentDashboard from './StudentDashboard'
const Pages = () => {
  return (
    <>
        <Routes>
        
          <Route path='/' element={<StudentDashboard/>}/>
        </Routes>
    </>
  )
}

export default Pages