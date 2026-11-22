import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  initFlagsmith,
  getVariation,
  destroyFlagsmith,
  waitForFlagsmith
} from '@services/flagsmith.js'
import { EXPERIMENT_VARIATIONS } from '@utils/constants.js'
import { useAuth } from './AuthContext.jsx'

const FlagsmithContext = createContext(null)

export function FlagsmithProvider({ children }) {
  const authContext = useAuth()
  console.log('[FlagsmithProvider] useAuth returned:', JSON.stringify({
    user: authContext.user ? { id: authContext.user.id, email: authContext.user.email } : null,
    loading: authContext.loading,
    isAuthenticated: authContext.isAuthenticated,
    experimentVariation: authContext.experimentVariation
  }))
  const { user, experimentVariation: storedVariation, loading: authLoading } = authContext
  const [variation, setVariation] = useState(storedVariation || EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  const evaluateFlag = useCallback(async () => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    if (!user) {
      setVariation(EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
      setLoading(false)
      setReady(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      initFlagsmith(user.id, {
        email: user.email,
        full_name: user.user_metadata?.full_name,
      })

      // Wait for flags to load
      const isReady = await waitForFlagsmith(8000)

      if (!isReady) {
        console.warn('[Flagsmith] Timeout waiting for initialization, using stored variation')
        setVariation(storedVariation || EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
        setLoading(false)
        setReady(true)
        return
      }

      const flagsmithVariation = await getVariation(user.id, {
        email: user.email,
        full_name: user.user_metadata?.full_name,
      })

      console.log('[FlagsmithContext] Final variation:', flagsmithVariation)
      const finalVariation = flagsmithVariation || storedVariation || EXPERIMENT_VARIATIONS.DAILY_PRACTICE
      setVariation(finalVariation)
      setReady(true)
    } catch (err) {
      console.error('[Flagsmith] Error evaluating flag:', err)
      setError(err.message)
      setVariation(storedVariation || EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
      setReady(true)
    } finally {
      setLoading(false)
    }
  }, [user, storedVariation, authLoading])

  // Debug: log state changes
  useEffect(() => {
    console.log('[FlagsmithContext] State:', { variation, loading, ready, error, user: user?.id })
  }, [variation, loading, ready, error, user])

  useEffect(() => {
    evaluateFlag()
  }, [evaluateFlag])

  useEffect(() => {
    return () => {
      destroyFlagsmith()
    }
  }, [])

  const value = {
    variation,
    loading,
    error,
    ready,
    isDailyPractice: variation === EXPERIMENT_VARIATIONS.DAILY_PRACTICE,
    isPersonalizedRoadmap: variation === EXPERIMENT_VARIATIONS.PERSONALIZED_ROADMAP,
    refreshVariation: evaluateFlag,
  }

  return (
    <FlagsmithContext.Provider value={value}>
      {children}
    </FlagsmithContext.Provider>
  )
}

export function useFlagsmith() {
  const context = useContext(FlagsmithContext)
  if (!context) {
    throw new Error('useFlagsmith must be used within a FlagsmithProvider')
  }
  return context
}