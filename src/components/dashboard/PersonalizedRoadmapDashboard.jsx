import { useState, useEffect } from 'react'
import { cn } from '@utils/helpers.js'
import {
  CheckCircle2,
  Clock,
  Code,
  Calculator,
  BookOpen,
  Target,
  Flag,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Trophy,
  Star,
  Lock,
} from 'lucide-react'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@components/common/Card.jsx'
import { Button } from '@components/common/Button.jsx'
import { LoadingSpinner, SkeletonCard } from '@components/common/LoadingSpinner.jsx'
import { MOCK_ROADMAP_DATA } from '@utils/constants.js'
import { trackDashboardViewed, trackRoadmapViewed, trackLearningGoalCompleted } from '@services/analytics.js'
import { useExperiment } from '@hooks/useFlagsmith.js'
import { useEventTracking } from '@hooks/useAnalytics.js'

function ProgressRing({ progress, size = 80, strokeWidth = 6, className = '' }) {
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
}

function WeekCard({ week, expanded, onToggle, onGoalComplete, onViewWeek, completedGoals, totalGoals, weekProgress }) {
  const isCurrentWeek = week.week === 1
  const isLocked = week.week > 1 && completedGoals < (week.week - 1) * 4

  return (
    <Card className={cn('overflow-hidden', isCurrentWeek && 'ring-2 ring-primary-200')}>
      <CardHeader className={cn('p-4 cursor-pointer', isLocked && 'opacity-60')} onClick={!isLocked ? onToggle : undefined}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', isCurrentWeek ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600')}>
              {isLocked ? (
                <Lock className="h-6 w-6" />
              ) : (
                <span className="text-xl font-bold">{week.week}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{week.title}</h3>
              <p className="text-sm text-gray-500">{week.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing progress={weekProgress} size={50} strokeWidth={4} />
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
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
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
}

function GoalCard({ goal, weekNumber, completed, onComplete }) {
  const typeIcons = {
    coding: Code,
    aptitude: Calculator,
  }
  const typeColors = {
    coding: 'bg-blue-100 text-blue-600',
    aptitude: 'bg-green-100 text-green-600',
  }
  const Icon = typeIcons[goal.type] || Target

  return (
    <div className={cn('card p-4 flex items-center gap-4', completed && 'bg-success-50 border-success-200')}>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', typeColors[goal.type])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{goal.title}</p>
        <p className="text-sm text-gray-500 capitalize">{goal.type} practice</p>
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
    </div>
  )
}

function MilestoneCard({ milestone, completed, index }) {
  const colors = [
    'bg-primary-100 text-primary-600',
    'bg-success-100 text-success-600',
    'bg-warning-100 text-warning-600',
    'bg-purple-100 text-purple-600',
  ]

  return (
    <div className="relative flex items-start gap-4">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', colors[index % colors.length])}>
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-white" />
          ) : (
            <span className="text-sm font-bold">{index + 1}</span>
          )}
        </div>
        {index < 3 && (
          <div className="absolute left-5 top-12 h-full w-0.5 bg-gray-200" />
        )}
      </div>
      <div className="flex-1 pt-1">
        <p className={cn('font-medium', completed ? 'text-gray-900' : 'text-gray-600')}>
          {milestone}
        </p>
        <p className="text-sm text-gray-400">
          {completed ? 'Achieved' : 'Upcoming milestone'}
        </p>
      </div>
    </div>
  )
}

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
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overallProgress}%</p>
            </div>
            <ProgressRing progress={overallProgress} size={60} strokeWidth={5} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Week {activeWeek}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Flag className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Goals Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedCount} / {totalGoals}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 text-success-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Week Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentWeekProgress}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Current Week Focus */}
      <Card className="p-5 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-700 font-medium">Current Focus</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{currentWeek?.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{currentWeek?.description}</p>
          </div>
          <ProgressRing progress={currentWeekProgress} size={70} strokeWidth={5} />
        </div>
      </Card>

      {/* Milestones Timeline */}
      <SectionHeader title="Learning Milestones" description="Key checkpoints in your placement journey" />
      <Card className="p-5">
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={index}
              milestone={milestone}
              completed={index < activeWeek - 1 || (index === activeWeek - 1 && currentWeekProgress === 100)}
              index={index}
            />
          ))}
        </div>
      </Card>

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
            totalGoals={totalGoals}
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

function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {action && action}
    </div>
  )
}