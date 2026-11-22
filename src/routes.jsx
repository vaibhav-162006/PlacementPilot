import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@pages/LandingPage.jsx'
import { LoginPage } from '@pages/LoginPage.jsx'
import { RegisterPage } from '@pages/RegisterPage.jsx'
import { DashboardPage } from '@pages/DashboardPage.jsx'
import { ProfilePage } from '@pages/ProfilePage.jsx'
import { AdminAnalyticsPage } from '@pages/AdminAnalyticsPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/admin/analytics',
    element: <AdminAnalyticsPage />,
  },
])