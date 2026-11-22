import { memo } from 'react'
import { cn } from '@utils/helpers.js'

const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  iconBg = 'bg-action/10',
  iconColor = 'text-action',
  trend,
  trendPositive = false,
  className = '',
}) {
  return (
    <div className={cn('card-base p-5 card-hover', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm mt-2 flex items-center gap-1',
              trendPositive ? 'text-success' : 'text-muted-foreground'
            )}>
              {trendPositive && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>}
              {trend}
            </p>
          )}
        </div>
        <div className={cn('icon-container icon-md shrink-0', iconBg, iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  )
})

StatCard.displayName = 'StatCard'

export { StatCard }