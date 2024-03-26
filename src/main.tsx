import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoginPage from './pages/LoginPage.tsx'
import {SignUpPage } from './pages/SignUpPage.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SignUpPage />
  </React.StrictMode>,
)
