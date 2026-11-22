import { useAuth } from '@contexts/AuthContext.jsx'

export function useAuthState() {
  const { user, profile, loading, experimentVariation, isAuthenticated } = useAuth()
  return { user, profile, loading, experimentVariation, isAuthenticated }
}

export function useAuthActions() {
  const { register, login, logout, updateProfile } = useAuth()
  return { register, login, logout, updateProfile }
}