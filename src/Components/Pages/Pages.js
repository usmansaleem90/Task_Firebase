import React from 'react'
import { Route,Routes } from 'react-router-dom'
import BareezeMan from './BareezeMan/BareezeMan'
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