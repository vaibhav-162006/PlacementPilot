import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  signUp,
  signIn,
  signOut,
  getSession,
  getUser,
  onAuthStateChange,
  createProfile,
  getProfile,
  updateProfile
} from '@services/supabase.js'
import { getExperimentAssignment, createExperimentAssignment } from '@services/supabase.js'
import { EXPERIMENT_VARIATIONS } from '@utils/constants.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [experimentVariation, setExperimentVariation] = useState(null)

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await getProfile(userId)
    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }, [])

  const fetchExperimentAssignment = useCallback(async (userId) => {
    const { data, error } = await getExperimentAssignment(userId)
    if (!error && data) {
      setExperimentVariation(data.variation)
      return data.variation
    }
    return null
  }, [])

  const initializeAuth = useCallback(async () => {
    const { session } = await getSession()
    if (session?.user) {
      setUser(session.user)
      await fetchProfile(session.user.id)
      await fetchExperimentAssignment(session.user.id)
    }
    setLoading(false)
  }, [fetchProfile, fetchExperimentAssignment])

  useEffect(() => {
    initializeAuth()

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)

        let variation = await fetchExperimentAssignment(session.user.id)

        if (!variation) {
          variation = EXPERIMENT_VARIATIONS.DAILY_PRACTICE
          await createExperimentAssignment(session.user.id, variation)
          setExperimentVariation(variation)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setExperimentVariation(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [initializeAuth, fetchProfile, fetchExperimentAssignment])

  const register = async (email, password, metadata = {}) => {
    setLoading(true)
    const { data, error } = await signUp(email, password, metadata)
    if (error) {
      setLoading(false)
      return { success: false, error }
    }
    if (data.user) {
      setUser(data.user)
      await createProfile(data.user.id, { email, ...metadata })
      const variation = EXPERIMENT_VARIATIONS.DAILY_PRACTICE
      await createExperimentAssignment(data.user.id, variation)
      setExperimentVariation(variation)
    }
    setLoading(false)
    return { success: true, data }
  }

  const login = async (email, password) => {
    setLoading(true)
    const { data, error } = await signIn(email, password)
    if (!error && data?.user) {
      setUser(data.user)
      await fetchProfile(data.user.id)
      let variation = await fetchExperimentAssignment(data.user.id)
      if (!variation) {
        variation = EXPERIMENT_VARIATIONS.DAILY_PRACTICE
        await createExperimentAssignment(data.user.id, variation)
        setExperimentVariation(variation)
      }
    }
    setLoading(false)
    return { success: !error, data, error }
  }

  const logout = async () => {
    const { error } = await signOut()
    return { success: !error, error }
  }

  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user' }
    const { data, error } = await updateProfile(user.id, updates)
    if (!error && data) {
      setProfile(data)
    }
    return { success: !error, data, error }
  }

  const value = {
    user,
    profile,
    loading,
    experimentVariation,
    register,
    login,
    logout,
    updateProfile: updateUserProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}