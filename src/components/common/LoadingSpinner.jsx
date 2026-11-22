import { memo } from 'react'
import { cn } from '@utils/helpers.js'

export const LoadingSpinner = memo(function LoadingSpinner({ size = 'md', className = '', color = 'primary' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-400',
  }

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], colorClasses[color], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export const LoadingOverlay = memo(function LoadingOverlay({ message = 'Loading...', className = '' }) {
  return (
    <div className={cn('fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50', className)}>
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  )
})

LoadingOverlay.displayName = 'LoadingOverlay'

export const Skeleton = memo(function Skeleton({ className = '', variant = 'text', width, height, ...props }) {
  const baseStyles = 'animate-pulse bg-gray-200 rounded'

  const variantStyles = {
    text: 'h-4',
    title: 'h-6 w-3/4',
    card: 'h-32',
    avatar: 'rounded-full',
    button: 'h-10 w-24 rounded-lg',
    circle: 'rounded-full',
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{ width, height }}
      {...props}
    />
  )
})

Skeleton.displayName = 'Skeleton'

export const SkeletonCard = memo(function SkeletonCard({ className = '' }) {
  return (
    <div className={cn('card animate-pulse', className)}>
      <Skeleton variant="card" className="mb-4" />
      <div className="space-y-3">
        <Skeleton variant="title" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  )
})

SkeletonCard.displayName = 'SkeletonCard'

export const SkeletonList = memo(function SkeletonList({ count = 5, className = '' }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
})

SkeletonList.displayName = 'SkeletonList'