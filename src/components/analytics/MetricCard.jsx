import { cn } from '@utils/helpers.js'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@components/common/Card.jsx'

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor = 'primary',
  className = ''
}) {
  const iconColors = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    error: 'bg-error-100 text-error-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success-600'
    if (change < 0) return 'text-error-600'
    return 'text-gray-500'
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-3.5 w-3.5" />
    if (change < 0) return <TrendingDown className="h-3.5 w-3.5" />
    return <Minus className="h-3.5 w-3.5" />
  }

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconColors[iconColor])}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={cn('text-sm font-medium', getChangeColor(change))}>
            {getChangeIcon(change)}
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500">{changeLabel}</span>
        </div>
      )}
    </Card>
  )
}