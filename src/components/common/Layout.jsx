import { useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { cn } from '@utils/helpers.js'
import {
  LayoutDashboard,
  User,
  BarChart3,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '@contexts/AuthContext.jsx'
import { Button } from './Button.jsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/profile', icon: User },
]

const adminNavigation = [
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export function Layout({ children }) {
  const { user, profile, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (!isAuthenticated) {
    return <Outlet />
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0',
          sidebarCollapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn('flex items-center justify-between h-16 px-4 border-b border-gray-100', sidebarCollapsed && 'justify-center')}>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-gray-900">PlacementPilot</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn('p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden', sidebarCollapsed && 'rotate-180')}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    sidebarCollapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              )
            })}

            {user?.email?.includes('admin') && (
              <>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <p className={cn('px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider', sidebarCollapsed && 'text-center')}>
                    Admin
                  </p>
                  {adminNavigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          sidebarCollapsed ? 'justify-center' : '',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )}
                        title={sidebarCollapsed ? item.name : undefined}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        {!sidebarCollapsed && <span>{item.name}</span>}
                      </NavLink>
                    )
                  })}
                </div>
              </>
            )}
          </nav>

          {/* User section */}
          <div className={cn('p-4 border-t border-gray-100', sidebarCollapsed && 'items-center')}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium">
                {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'Student'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <NavLink
                to="/profile"
                className={cn('flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900', sidebarCollapsed && 'justify-center')}
                title={sidebarCollapsed ? 'Profile' : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <User className="h-4 w-4" />
                {!sidebarCollapsed && <span>Profile</span>}
              </NavLink>
              <Button
                variant="ghost"
                size="sm"
                className={cn('flex-1', sidebarCollapsed && 'w-9')}
                onClick={handleLogout}
                title={sidebarCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="h-4 w-4" />
                {!sidebarCollapsed && <span>Logout</span>}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn('lg:pl-64 transition-all duration-300', sidebarCollapsed && 'lg:pl-20')}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-gray-900">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/profile' && 'Profile'}
                {location.pathname === '/admin/analytics' && 'Admin Analytics'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-5 lg:p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}

export function PageHeader({ title, description, action, className = '' }) {
  return (
    <div className={cn('mb-4', className)}>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {description && <p className="mt-1 text-gray-600">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export { SectionHeader } from './SectionHeader.jsx'