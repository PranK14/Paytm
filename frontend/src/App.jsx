import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React from 'react'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { SendMoney } from './pages/SendMoney'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
