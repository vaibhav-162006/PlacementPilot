import { memo } from 'react'
import { cn } from '@utils/helpers.js'

const SectionHeader = memo(function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  )
})

SectionHeader.displayName = 'SectionHeader'

export { SectionHeader }