import { useState, useEffect, memo } from 'react'
import { cn } from '@utils/helpers.js'
import {
  CheckCircle2,
  Code,
  Calculator,
  BookOpen,
  Target,
  Flag,
  ChevronDown,
  ChevronRight,
  Star,
  Lock,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { Card, CardHeader, CardBody } from '@components/common/Card.jsx'
import { Button } from '@components/common/Button.jsx'
import { Badge } from '@components/common/Badge.jsx'
import { SkeletonCard } from '@components/common/LoadingSpinner.jsx'
import { SectionHeader } from '@components/common/SectionHeader.jsx'
import { MOCK_ROADMAP_DATA } from '@utils/constants.js'
import { useExperiment } from '@hooks/useFlagsmith.js'
import { useEventTracking } from '@hooks/useAnalytics.js'

const ProgressRing = memo(function ProgressRing({ progress, size = 80, strokeWidth = 6, className = '' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-200"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="text-success-600 transition-all duration-500"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{progress}%</span>
      </div>
    </div>
  )
})

ProgressRing.displayName = 'ProgressRing'

const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  iconBg = 'bg-primary-100',
  iconColor = 'text-primary-600',
  trend,
  trendPositive = false,
}) {
  return (
    <Card className="p-5 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm mt-2 flex items-center gap-1',
              trendPositive ? 'text-success-600' : 'text-muted-foreground'
            )}>
              {trendPositive && <TrendingUp className="h-3.5 w-3.5" />}
              {trend}
            </p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shrink-0', iconBg, iconColor)}>
          {icon}
        </div>
      </div>
    </Card>
  )
})

StatCard.displayName = 'StatCard'

const WeekCard = memo(function WeekCard({ week, expanded, onToggle, onGoalComplete, onViewWeek, completedGoals, weekProgress }) {
  const isCurrentWeek = week.week === 1
  const isLocked = week.week > 1 && completedGoals < (week.week - 1) * 4
  const weekCompleted = week.goals.filter(g => completedGoals.has(g.id)).length

  return (
    <Card className={cn('overflow-hidden transition-all duration-200', isCurrentWeek && 'ring-2 ring-primary-200', isLocked && 'opacity-60')}>
      <CardHeader className={cn('p-4', !isLocked && 'cursor-pointer hover:bg-muted/50')} onClick={!isLocked ? onToggle : undefined}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', isCurrentWeek ? 'bg-primary-100 text-primary-600' : 'bg-muted text-muted-foreground')}>
              {isLocked ? (
                <Lock className="h-6 w-6" />
              ) : (
                <span className="text-xl font-bold">{week.week}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{week.title}</h3>
                {!isLocked && isCurrentWeek && (
                  <Badge variant="primary" className="text-xs">Current</Badge>
                )}
                {isLocked && <Badge variant="gray" className="text-xs">Locked</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{week.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing progress={weekProgress} size={50} strokeWidth={4} />
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success-600" />
              <span>{weekCompleted}/{week.goals.length}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              onClick={(e) => { e.stopPropagation(); onViewWeek(week.week); }}
            >
              View
            </Button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              aria-label={expanded ? 'Collapse week' : 'Expand week'}
            >
              {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </CardHeader>

      {expanded && !isLocked && (
        <CardBody className="pt-0">
          <div className="space-y-3">
            {week.goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                weekNumber={week.week}
                completed={completedGoals.has(goal.id)}
                onComplete={onGoalComplete}
              />
            ))}
          </div>
        </CardBody>
      )}

      {isLocked && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Complete Week {week.week - 1} to unlock this week
          </p>
        </div>
      )}
    </Card>
  )
})

WeekCard.displayName = "WeekCard"

const GoalCard = memo(function GoalCard({ goal, weekNumber, completed, onComplete }) {
  const typeIcons = {
    coding: Code,
    aptitude: Calculator,
  }
  const typeColors = {
    coding: { bg: 'bg-primary-100', text: 'text-primary-600' },
    aptitude: { bg: 'bg-success-100', text: 'text-success-600' },
  }
  const Icon = typeIcons[goal.type] || Target
  const colors = typeColors[goal.type] || { bg: 'bg-primary-100', text: 'text-primary-600' }

  return (
    <Card className={cn('p-4 flex items-center gap-4 transition-all duration-200', completed && 'bg-success-50 border-success-200')}>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.bg, colors.text)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{goal.title}</p>
        <p className="text-sm text-muted-foreground capitalize">{goal.type} practice</p>
      </div>
      <Button
        variant={completed ? 'success' : 'outline'}
        size="sm"
        onClick={() => onComplete(goal.id, weekNumber)}
        disabled={completed}
      >
        {completed ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </>
        ) : (
          'Mark Complete'
        )}
      </Button>
    </Card>
  )
})

GoalCard.displayName = "GoalCard"

const MilestoneCard = memo(function MilestoneCard({ milestone, completed, index }) {
  const milestoneColors = [
    { bg: 'bg-primary-100', text: 'text-primary-600', border: 'border-primary-200', icon: Sparkles },
    { bg: 'bg-success-100', text: 'text-success-600', border: 'border-success-200', icon: Zap },
    { bg: 'bg-accent-100', text: 'text-accent-600', border: 'border-accent-200', icon: ArrowRight },
    { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', icon: Target },
  ]
  const color = milestoneColors[index % milestoneColors.length]
  const Icon = color.icon

  return (
    <Card className={cn('p-4 flex items-start gap-4 transition-all duration-200', completed && 'bg-success-50 border-success-200')}>
      <div className="relative flex items-start gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', color.bg, color.text)}>
            {completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </div>
          {index < 3 && (
            <div className="absolute left-5 top-12 h-full w-0.5 bg-border" />
          )}
        </div>
        <div className="flex-1 pt-1">
          <p className={cn('font-medium', completed ? 'text-foreground' : 'text-muted-foreground')}>
            {milestone}
          </p>
          <p className="text-sm text-muted-foreground">
            {completed ? 'Achieved' : 'Upcoming milestone'}
          </p>
        </div>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', completed ? 'bg-success-100 text-success-600' : color.bg + ' ' + color.text)}>
          {completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <span className="text-sm font-bold">{index + 1}</span>
          )}
        </div>
      </div>
    </Card>
  )
})

MilestoneCard.displayName = "MilestoneCard"

export function PersonalizedRoadmapDashboard() {
  const { variation, ready } = useExperiment()
  const { trackDashboardView, trackRoadmapView, trackGoalComplete } = useEventTracking()
  const [weeks, setWeeks] = useState([])
  const [expandedWeeks, setExpandedWeeks] = useState(new Set([1]))
  const [completedGoals, setCompletedGoals] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [activeWeek, setActiveWeek] = useState(1)

  useEffect(() => {
    if (ready && variation === 'personalized_roadmap') {
      setWeeks(MOCK_ROADMAP_DATA.weeks)
      setLoading(false)
      trackDashboardView()
      trackRoadmapView(1)
    }
  }, [ready, variation, trackDashboardView, trackRoadmapView])

  const toggleWeek = (weekNumber) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev)
      if (next.has(weekNumber)) {
        next.delete(weekNumber)
      } else {
        next.add(weekNumber)
      }
      return next
    })
  }

  const handleGoalComplete = async (goalId, weekNumber) => {
    setCompletedGoals(prev => {
      const next = new Set(prev)
      next.add(goalId)
      return next
    })
    await trackGoalComplete(goalId, weekNumber)
  }

  const handleViewWeek = (weekNumber) => {
    setActiveWeek(weekNumber)
    trackRoadmapView(weekNumber)
  }

  const totalGoals = weeks.reduce((acc, week) => acc + week.goals.length, 0)
  const completedCount = completedGoals.size
  const overallProgress = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0

  const currentWeek = weeks.find(w => w.week === activeWeek) || weeks[0]
  const currentWeekGoals = currentWeek?.goals || []
  const currentWeekCompleted = currentWeekGoals.filter(g => completedGoals.has(g.id)).length
  const currentWeekProgress = currentWeekGoals.length > 0 ? Math.round((currentWeekCompleted / currentWeekGoals.length) * 100) : 0

  const milestones = [
    'Complete Foundation Week',
    'Master Core Data Structures',
    'Finish Algorithm Fundamentals',
    'Ready for Mock Interviews',
  ]

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          icon={<ProgressRing progress={overallProgress} size={56} strokeWidth={4} />}
          trend="+15% this month"
          trendPositive
        />
        <StatCard
          title="Current Week"
          value={`Week ${activeWeek}`}
          icon={<Flag className="h-6 w-6" />}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
          trend="On track"
          trendPositive
        />
        <StatCard
          title="Goals Completed"
          value={`${completedCount} / ${totalGoals}`}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconBg="bg-success-100"
          iconColor="text-success-600"
          trend="+3 this week"
          trendPositive
        />
        <StatCard
          title="This Week Progress"
          value={`${currentWeekProgress}%`}
          icon={<Star className="h-6 w-6" />}
          iconBg="bg-accent-100"
          iconColor="text-accent-600"
          trend="Keep pushing!"
        />
      </div>

      {/* Current Week Focus */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 via-primary-100 to-accent-50 border-primary-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%230D9488%22 fill-opacity%3D%220.03%22%3E%3Cpath d%3D%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1 pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Current Focus
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{currentWeek?.title}</h3>
            <p className="text-gray-600 mt-1 max-w-xl">{currentWeek?.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <ProgressRing progress={currentWeekProgress} size={60} strokeWidth={4} />
              <div>
                <p className="text-sm text-muted-foreground">Week Progress</p>
                <p className="text-2xl font-bold text-primary-600">{currentWeekProgress}%</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Sparkles className="h-16 w-16 text-primary-300 opacity-50" />
          </div>
        </div>
      </Card>

      {/* Milestones Timeline */}
      <SectionHeader title="Learning Milestones" description="Key checkpoints in your placement journey" />
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <MilestoneCard
            key={index}
              milestone={milestone}
              completed={index < activeWeek - 1 || (index === activeWeek - 1 && currentWeekProgress === 100)}
              index={index}
            />
          ))}
        </div>

      {/* Weekly Roadmap */}
      <SectionHeader
        title="Weekly Roadmap"
        description="Expand each week to see your learning goals"
      />
      <div className="space-y-4">
        {weeks.map((week) => (
          <WeekCard
            key={week.week}
            week={week}
            expanded={expandedWeeks.has(week.week)}
            onToggle={() => toggleWeek(week.week)}
            onGoalComplete={handleGoalComplete}
            onViewWeek={handleViewWeek}
            completedGoals={completedGoals}
            weekProgress={week.goals.length > 0
              ? Math.round((week.goals.filter(g => completedGoals.has(g.id)).length / week.goals.length) * 100)
              : 0}
          />
        ))}
      </div>

      {/* Recommended Resources */}
      <SectionHeader title="Recommended Resources" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-3">
            <Code className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-gray-900">LeetCode 75</h4>
          <p className="text-sm text-gray-500 mt-1">Essential 75 problems for interview prep</p>
        </Card>
        <Card className="p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 mb-3">
            <Calculator className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-gray-900">Quantitative Aptitude</h4>
          <p className="text-sm text-gray-500 mt-1">Complete guide with shortcuts & tricks</p>
        </Card>
        <Card className="p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h4 className="font-semibold text-gray-900">System Design Primer</h4>
          <p className="text-sm text-gray-500 mt-1">Learn to design scalable systems</p>
        </Card>
      </div>
    </div>
  )
}