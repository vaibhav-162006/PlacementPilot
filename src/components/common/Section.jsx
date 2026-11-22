import { memo } from 'react'
import { cn } from '@utils/helpers.js'

export const Section = memo(function Section({
  title,
  description,
  action,
  children,
  className = '',
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div>{children}</div>
    </section>
  )
})

Section.displayName = 'Section'

export const ContentCard = memo(function ContentCard({
  icon,
  iconBg = 'bg-action/10',
  iconColor = 'text-action',
  title,
  description,
  meta,
  action,
  className = '',
  onClick,
}) {
  return (
    <article
      className={cn(
        'card-base p-4 card-hover flex items-start gap-4',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('icon-container icon-md shrink-0', iconBg, iconColor)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        {meta && <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">{meta}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </article>
  )
})

ContentCard.displayName = 'ContentCard'

export const GoalCard = memo(function GoalCard({
  goal,
  completed,
  onToggle,
  className = '',
}) {
  const typeConfig = {
    coding: { icon: '💻', iconBg: 'bg-action/10', iconColor: 'text-action' },
    aptitude: { icon: '🧮', iconBg: 'bg-success/10', iconColor: 'text-success' },
    reading: { icon: '📖', iconBg: 'bg-warning/10', iconColor: 'text-warning' },
    mock: { icon: '🎯', iconBg: 'bg-error/10', iconColor: 'text-error' },
  }

  const config = typeConfig[goal.type] || { icon: '📌', iconBg: 'bg-muted', iconColor: 'text-muted' }

  return (
    <div className={cn(
      'card-base p-4 flex items-center gap-4 transition-colors',
      completed && 'bg-success-bg border-success',
      className
    )}>
      <span className="text-xl" role="img" aria-label={goal.type}>{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{goal.title}</p>
        <p className="text-sm text-muted-foreground">Target: {goal.target} {goal.unit}{goal.target > 1 ? 's' : ''}</p>
      </div>
      <button
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
          completed
            ? 'bg-success text-white'
            : 'border border-border text-foreground hover:bg-muted'
        )}
        onClick={onToggle}
        disabled={completed}
      >
        {completed ? 'Done' : 'Start'}
      </button>
    </div>
  )
})

GoalCard.displayName = 'GoalCard'

export const PracticeCard = memo(function PracticeCard({
  practice,
  onStart,
  loading,
  className = '',
}) {
  const difficultyConfig = {
    Easy: { color: 'text-success', bg: 'bg-success/10' },
    Medium: { color: 'text-warning', bg: 'bg-warning/10' },
    Hard: { color: 'text-error', bg: 'bg-error/10' },
  }

  const diff = difficultyConfig[practice.difficulty] || difficultyConfig.Medium

  return (
    <article className={cn('card-base p-4 flex items-center justify-between gap-4 card-hover', className)}>
      <div className="flex items-center gap-4">
        <div className="icon-container icon-md bg-action/10 text-action">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{practice.title}</h4>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className={cn('badge-base', diff.bg, diff.color)}>{practice.difficulty}</span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {practice.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              {practice.topic}
            </span>
          </div>
        </div>
      </div>
      <button
        className="btn-primary gap-2"
        onClick={() => onStart(practice)}
        disabled={loading}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        {loading ? 'Starting...' : 'Start'}
      </button>
    </article>
  )
})

PracticeCard.displayName = 'PracticeCard'

export const WeekCard = memo(function WeekCard({
  week,
  expanded,
  onToggle,
  onGoalComplete,
  onViewWeek,
  completedGoals,
  weekProgress,
  className = '',
}) {
  const isCurrentWeek = week.week === 1
  const isLocked = week.week > 1 && completedGoals.size < (week.week - 1) * 4
  const weekCompleted = week.goals.filter(g => completedGoals.has(g.id)).length

  return (
    <article className={cn(
      'card-base overflow-hidden transition-colors',
      isCurrentWeek && 'ring-2 ring-action/50',
      isLocked && 'opacity-60',
      className
    )}>
      <header className={cn('p-4', !isLocked && 'cursor-pointer hover:bg-muted')} onClick={!isLocked ? onToggle : undefined}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn('icon-container icon-md', isCurrentWeek ? 'bg-action/10 text-action' : 'bg-muted text-muted-foreground')}>
              {isLocked ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              ) : (
                <span className="font-display text-xl font-bold">{week.week}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{week.title}</h3>
                {!isLocked && isCurrentWeek && <span className="badge-primary text-xs">Current</span>}
                {isLocked && <span className="badge-gray text-xs">Locked</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{week.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing progress={weekProgress} size={50} strokeWidth={4} showValue={true} />
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{weekCompleted}/{week.goals.length}</span>
            </div>
            <button
              className="btn-secondary btn-base px-3 py-1.5 text-xs"
              onClick={(e) => { e.stopPropagation(); onViewWeek(week.week); }}
            >
              View
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              aria-label={expanded ? 'Collapse week' : 'Expand week'}
            >
              {expanded ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>}
            </button>
          </div>
        </div>
      </header>

      {expanded && !isLocked && (
        <div className="pt-0 px-4 pb-4">
          <div className="space-y-3">
            {week.goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                completed={completedGoals.has(goal.id)}
                onToggle={() => onGoalComplete(goal.id, week.week)}
              />
            ))}
          </div>
        </div>
      )}

      {isLocked && (
        <div className="px-4 py-4 bg-muted/50 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">Complete Week {week.week - 1} to unlock this week</p>
        </div>
      )}
    </article>
  )
})

WeekCard.displayName = 'WeekCard'

export const MilestoneCard = memo(function MilestoneCard({
  milestone,
  completed,
  index,
  className = '',
}) {
  const milestoneConfig = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, color: 'text-action', bg: 'bg-action/10' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 2"/></svg>, color: 'text-success', bg: 'bg-success/10' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>, color: 'text-warning', bg: 'bg-warning/10' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, color: 'text-error', bg: 'bg-error/10' },
  ]

  const config = milestoneConfig[index % milestoneConfig.length]

  return (
    <article className={cn('card-base p-4 flex items-start gap-4 transition-colors', completed && 'bg-success-bg border-success', className)}>
      <div className="relative flex items-start gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', config.bg, config.color)}>
            {completed ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              config.icon
            )}
          </div>
          {index < 3 && (
            <div className="absolute left-5 top-12 h-full w-px bg-border" />
          )}
        </div>
        <div className="flex-1 pt-1">
          <p className={cn('font-medium', completed ? 'text-foreground' : 'text-muted-foreground')}>{milestone}</p>
          <p className="text-sm text-muted-foreground">{completed ? 'Achieved' : 'Upcoming milestone'}</p>
        </div>
        <div className={cn('icon-container icon-sm shrink-0', completed ? 'bg-success text-white' : config.bg + ' ' + config.color)}>
          {completed ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <span className="text-sm font-bold">{index + 1}</span>
          )}
        </div>
      </div>
    </article>
  )
})

MilestoneCard.displayName = 'MilestoneCard'

export const StatCard = memo(function StatCard({
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
            <p className={cn('text-sm mt-2 flex items-center gap-1', trendPositive ? 'text-success' : 'text-muted-foreground')}>
              {trendPositive && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>}
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