import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  initFlagsmith,
  getVariation,
  destroyFlagsmith,
  waitForFlagsmith,
  isFlagsmithReady
} from '@services/flagsmith.js'
import { EXPERIMENT_VARIATIONS } from '@utils/constants.js'
import { useAuth } from './AuthContext.jsx'

const FlagsmithContext = createContext(null)

export function FlagsmithProvider({ children }) {
  const { user, experimentVariation: storedVariation } = useAuth()
  const [variation, setVariation] = useState(storedVariation || EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  const evaluateFlag = useCallback(async () => {
    if (!user) {
      setVariation(EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      initFlagsmith(user.id, {
        email: user.email,
        full_name: user.user_metadata?.full_name,
      })

      const isReady = await waitForFlagsmith(5000)

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
  }, [user, storedVariation])

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