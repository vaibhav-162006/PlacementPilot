import { cn } from '@utils/helpers.js'

export function Card({ children, className = '', hover = true, padding = 'default', ...props }) {
  const paddingStyles = {
    none: '',
    default: 'p-6',
    sm: 'p-4',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-card transition-shadow duration-200',
        hover && 'hover:shadow-card-hover',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', action, ...props }) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-4 border-b border-gray-100', className)} {...props}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={cn('flex items-center px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)} {...props}>
      {children}
    </p>
  )
}