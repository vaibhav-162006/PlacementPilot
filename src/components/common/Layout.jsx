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
  Sun,
  Moon,
} from 'lucide-react'
import { useAuth } from '@contexts/AuthContext.jsx'
import { useTheme } from '@contexts/ThemeContext.jsx'
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
  const { theme, toggleTheme, isDark } = useTheme()
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
    <div className="min-h-screen bg-background">
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
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out lg:relative lg:translate-x-0',
          sidebarCollapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn('flex items-center justify-between h-16 px-4 border-b border-border', sidebarCollapsed && 'justify-center')}>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-foreground">PlacementPilot</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn('p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden', sidebarCollapsed && 'rotate-180')}
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
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                <div className="pt-4 mt-4 border-t border-border">
                  <p className={cn('px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider', sidebarCollapsed && 'text-center')}>
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
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
          <div className={cn('p-4 border-t border-border', sidebarCollapsed && 'items-center')}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium">
                {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || 'Student'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <NavLink
                to="/profile"
                className={cn('flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground', sidebarCollapsed && 'justify-center')}
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
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-foreground">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/profile' && 'Profile'}
                {location.pathname === '/admin/analytics' && 'Admin Analytics'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="hidden sm:flex"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className="hidden sm:flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 sm:p-4 lg:p-5" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}

export function PageHeader({ title, description, action, className = '' }) {
  return (
    <div className={cn('mb-2', className)}>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export { SectionHeader } from './SectionHeader.jsx'