import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@components/common/LoadingSpinner.jsx'

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

// Lazy load page components for code splitting (handle named exports)
const LandingPage = lazy(() => import('@pages/LandingPage.jsx').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@pages/LoginPage.jsx').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@pages/RegisterPage.jsx').then(m => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('@pages/DashboardPage.jsx').then(m => ({ default: m.DashboardPage })))
const ProfilePage = lazy(() => import('@pages/ProfilePage.jsx').then(m => ({ default: m.ProfilePage })))
const AdminAnalyticsPage = lazy(() => import('@pages/AdminAnalyticsPage.jsx').then(m => ({ default: m.AdminAnalyticsPage })))

// Wrapper components that add Suspense boundary
function LandingPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LandingPage />
    </Suspense>
  )
}

function LoginPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginPage />
    </Suspense>
  )
}

function RegisterPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterPage />
    </Suspense>
  )
}

function DashboardPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardPage />
    </Suspense>
  )
}

function ProfilePageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProfilePage />
    </Suspense>
  )
}

function AdminAnalyticsPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminAnalyticsPage />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageWrapper />,
  },
  {
    path: '/login',
    element: <LoginPageWrapper />,
  },
  {
    path: '/register',
    element: <RegisterPageWrapper />,
  },
  {
    path: '/dashboard',
    element: <DashboardPageWrapper />,
  },
  {
    path: '/profile',
    element: <ProfilePageWrapper />,
  },
  {
    path: '/admin/analytics',
    element: <AdminAnalyticsPageWrapper />,
  },
])