import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@styles/index.css'
import App from './App.jsx'
import { AuthProvider } from '@contexts/AuthContext.jsx'
import { FlagsmithProvider } from '@contexts/FlagsmithContext.jsx'
import { AnalyticsProvider } from '@contexts/AnalyticsContext.jsx'
import { flushAnalyticsEvents } from '@services/analytics.js'

// Flush events before page unload
window.addEventListener('beforeunload', async () => {
  await flushAnalyticsEvents()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FlagsmithProvider>
          <AnalyticsProvider>
            <App />
          </AnalyticsProvider>
        </FlagsmithProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)