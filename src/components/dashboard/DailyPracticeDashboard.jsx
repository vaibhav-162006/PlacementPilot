import { useState, useEffect, memo } from 'react'
import { cn } from '@utils/helpers.js'
import {
  CheckCircle2,
  Clock,
  Code,
  Calculator,
  BookOpen,
  Target,
  Flame,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Card } from '@components/common/Card.jsx'
import { Button } from '@components/common/Button.jsx'
import { Badge } from '@components/common/Badge.jsx'
import { LoadingSpinner, SkeletonCard } from '@components/common/LoadingSpinner.jsx'
import { SectionHeader } from '@components/common/SectionHeader.jsx'
import { MOCK_PRACTICE_DATA, DAILY_GOALS } from '@utils/constants.js'
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
          className="text-primary-600 transition-all duration-500"
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

const DailyGoalCard = memo(function DailyGoalCard({ goal, completed, onToggle }) {
  const icons = {
    coding: Code,
    aptitude: Calculator,
    reading: BookOpen,
    mock: Target,
  }

  const Icon = icons[goal.type] || Target
  const typeColors = {
    coding: { bg: 'bg-primary-100', text: 'text-primary-600' },
    aptitude: { bg: 'bg-success-100', text: 'text-success-600' },
    reading: { bg: 'bg-purple-100', text: 'text-purple-600' },
    mock: { bg: 'bg-accent-100', text: 'text-accent-600' },
  }
  const colors = typeColors[goal.type] || { bg: 'bg-primary-100', text: 'text-primary-600' }

  return (
    <Card className={cn('p-4 flex items-center gap-4 transition-all duration-200', completed && 'bg-success-50 border-success-200')}>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.bg, colors.text)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{goal.title}</p>
        <p className="text-sm text-muted-foreground">Target: {goal.target} {goal.unit}{goal.target > 1 ? 's' : ''}</p>
      </div>
      <Button
        variant={completed ? 'success' : 'outline'}
        size="sm"
        onClick={onToggle}
        disabled={completed}
      >
        {completed ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Done
          </>
        ) : (
          'Start'
        )}
      </Button>
    </Card>
  )
})

DailyGoalCard.displayName = 'DailyGoalCard'

const PracticeCard = memo(function PracticeCard({ practice, onStart, loading }) {
  const difficultyColors = {
    Easy: { badge: 'bg-success-100 text-success-700', icon: '🟢' },
    Medium: { badge: 'bg-warning-100 text-warning-700', icon: '🟡' },
    Hard: { badge: 'bg-error-100 text-error-700', icon: '🔴' },
  }
  const difficulty = difficultyColors[practice.difficulty] || difficultyColors.Medium

  return (
    <Card className="p-4 flex items-center justify-between transition-all duration-200 hover:shadow-card-hover group">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 group-hover:scale-110 transition-transform duration-200">
          <Code className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{practice.title}</h4>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <Badge variant="primary" className="text-xs">{practice.difficulty}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {practice.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {practice.topic}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onStart(practice)}
        disabled={loading}
        leftIcon={loading && <LoadingSpinner size="sm" color="white" />}
        className="group-hover:bg-accent-600 transition-colors"
      >
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        Start
      </Button>
    </Card>
  )
})

PracticeCard.displayName = 'PracticeCard'

export function DailyPracticeDashboard() {
  const { variation, ready } = useExperiment()
  const { trackDashboardView, trackPracticeStart } = useEventTracking()
  const [codingPractices, setCodingPractices] = useState([])
  const [aptitudePractices, setAptitudePractices] = useState([])
  const [goals, setGoals] = useState([])
  const [completedGoals, setCompletedGoals] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [startingSession, setStartingSession] = useState(null)
  const [streak] = useState(7)
  const [totalCompleted] = useState(23)

  useEffect(() => {
    if (ready && variation === 'daily_practice') {
      setCodingPractices(MOCK_PRACTICE_DATA.coding)
      setAptitudePractices(MOCK_PRACTICE_DATA.aptitude)
      setGoals(DAILY_GOALS.map(g => ({ ...g, completed: false })))
      setLoading(false)
      trackDashboardView()
    }
  }, [ready, variation, trackDashboardView])

  const handleStartPractice = async (practice) => {
    setStartingSession(practice.id)
    const sessionId = `practice-${Date.now()}`
    await trackPracticeStart('coding', sessionId)

    setTimeout(() => {
      setStartingSession(null)
      alert(`Starting: ${practice.title}\n\nIn a real app, this would navigate to the practice interface.`)
    }, 500)
  }

  const handleToggleGoal = (goalId) => {
    setCompletedGoals(prev => {
      const next = new Set(prev)
      if (next.has(goalId)) {
        next.delete(goalId)
      } else {
        next.add(goalId)
      }
      return next
    })
  }

  const completedCount = completedGoals.size
  const totalGoals = goals.length
  const progress = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0

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
          title="Daily Progress"
          value={`${progress}%`}
          icon={<ProgressRing progress={progress} size={56} strokeWidth={4} />}
          trend="+12% from yesterday"
          trendPositive
        />
        <StatCard
          title="Coding Streak"
          value={`${streak} days`}
          icon={<Flame className="h-6 w-6" />}
          iconBg="bg-accent-100"
          iconColor="text-accent-600"
          trend="Keep it up! 🔥"
        />
        <StatCard
          title="Total Solved"
          value={totalCompleted}
          icon={<CheckCircle2 className="h-6 w-6" />}
          iconBg="bg-success-100"
          iconColor="text-success-600"
          trend="+3 this week"
          trendPositive
        />
        <StatCard
          title="This Week"
          value="12"
          icon={<TrendingUp className="h-6 w-6" />}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
          trend="On track"
          trendPositive
        />
      </div>

      {/* Daily Goals */}
      <SectionHeader title="Today's Goals" description="Complete these daily targets to maintain your streak" />
      <div className="space-y-3">
        {goals.map((goal) => (
          <DailyGoalCard
            key={goal.id}
            goal={goal}
            completed={completedGoals.has(goal.id)}
            onToggle={() => handleToggleGoal(goal.id)}
          />
        ))}
      </div>

      {/* Coding Practice */}
      <SectionHeader
        title="Daily Coding Challenges"
        description="Fresh problems every day to sharpen your skills"
        action={
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        }
      />
      <div className="space-y-3">
        {codingPractices.map((practice) => (
          <PracticeCard
            key={practice.id}
            practice={practice}
            onStart={handleStartPractice}
            loading={startingSession === practice.id}
          />
        ))}
      </div>

      {/* Aptitude Practice */}
      <SectionHeader title="Daily Aptitude Questions" description="Quantitative aptitude practice for placement tests" />
      <div className="space-y-3">
        {aptitudePractices.map((practice) => (
          <PracticeCard
            key={practice.id}
            practice={{ ...practice, type: 'aptitude' }}
            onStart={handleStartPractice}
            loading={startingSession === practice.id}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" leftIcon={<Code className="h-4 w-4" />}>
          Random Problem
        </Button>
        <Button variant="outline" leftIcon={<Calculator className="h-4 w-4" />}>
          Aptitude Quiz
        </Button>
        <Button variant="outline" leftIcon={<Target className="h-4 w-4" />}>
          Mock Test
        </Button>
        <Button variant="outline" leftIcon={<BookOpen className="h-4 w-4" />}>
          View Solutions
        </Button>
      </div>
    </div>
  )
}