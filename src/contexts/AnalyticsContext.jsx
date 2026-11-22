import { createContext, useContext, useEffect } from 'react'
import { setAnalyticsContext, resetAnalyticsContext } from '@services/analytics.js'
import { useAuth } from './AuthContext.jsx'
import { useFlagsmith } from './FlagsmithContext.jsx'

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }) {
  const { user } = useAuth()
  const { variation, ready } = useFlagsmith()

  useEffect(() => {
    if (user && ready && variation) {
      setAnalyticsContext(user.id, variation)
    } else {
      resetAnalyticsContext()
    }
  }, [user, ready, variation])

  return (
    <AnalyticsContext.Provider value={{}}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}