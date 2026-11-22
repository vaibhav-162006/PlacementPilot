import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@components/common/LoadingSpinner.jsx'

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
)

// Lazy load page components for code splitting
const LandingPage = lazy(() => import('@pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('@pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('@pages/RegisterPage.jsx'))
const DashboardPage = lazy(() => import('@pages/DashboardPage.jsx'))
const ProfilePage = lazy(() => import('@pages/ProfilePage.jsx'))
const AdminAnalyticsPage = lazy(() => import('@pages/AdminAnalyticsPage.jsx'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(LandingPage),
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/dashboard',
    element: withSuspense(DashboardPage),
  },
  {
    path: '/profile',
    element: withSuspense(ProfilePage),
  },
  {
    path: '/admin/analytics',
    element: withSuspense(AdminAnalyticsPage),
  },
])