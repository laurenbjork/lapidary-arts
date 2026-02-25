import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { InquiryProvider } from './context/InquiryContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <InquiryProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </InquiryProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
