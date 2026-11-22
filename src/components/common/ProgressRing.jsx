import { memo } from 'react'
import { cn } from '@utils/helpers.js'

const ProgressRing = memo(function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 4,
  className = '',
  showValue = true,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const ringStyle = {
    '--circumference': circumference,
    '--offset': offset,
    width: size,
    height: size,
  }

  return (
    <div className={cn('relative inline-flex', className)} style={ringStyle}>
      <svg width={size} height={size} className="transform -rotate-90" role="img" aria-label={`${progress}% complete`}>
        <circle
          className="text-muted"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn('progress-ring-circle text-action transition-all duration-500', 'progress-ring-circle')}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-bold text-foreground">{progress}%</span>
        </div>
      )}
    </div>
  )
})

ProgressRing.displayName = 'ProgressRing'

export { ProgressRing }