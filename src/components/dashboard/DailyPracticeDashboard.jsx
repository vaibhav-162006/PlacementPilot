import { useState, useEffect } from 'react'
import { cn } from '@utils/helpers.js'
import {
  CheckCircle2,
  Clock,
  Code,
  Calculator,
  BookOpen,
  Target,
  Flame,
  ArrowRight,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@components/common/Card.jsx'
import { Button } from '@components/common/Button.jsx'
import { LoadingSpinner, SkeletonCard } from '@components/common/LoadingSpinner.jsx'
import { MOCK_PRACTICE_DATA, DAILY_GOALS } from '@utils/constants.js'
import { trackDashboardViewed, trackPracticeStarted, trackPracticeCompleted } from '@services/analytics.js'
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
}

function DailyGoalCard({ goal, completed, onToggle }) {
  const icons = {
    coding: Code,
    aptitude: Calculator,
    reading: BookOpen,
    mock: Target,
  }

  const Icon = icons[goal.type] || Target
  const colors = {
    coding: 'bg-blue-100 text-blue-600',
    aptitude: 'bg-green-100 text-green-600',
    reading: 'bg-purple-100 text-purple-600',
    mock: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className={cn('card p-4 flex items-center gap-4', completed && 'bg-success-50 border-success-200')}>
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colors[goal.type])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{goal.title}</p>
        <p className="text-sm text-gray-500">Target: {goal.target} {goal.unit}{goal.target > 1 ? 's' : ''}</p>
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
    </div>
  )
}

function PracticeCard({ practice, onStart, loading }) {
  const difficultyColors = {
    Easy: 'bg-success-100 text-success-700',
    Medium: 'bg-warning-100 text-warning-700',
    Hard: 'bg-error-100 text-error-700',
  }

  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
          <Code className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{practice.title}</h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className={cn('badge', difficultyColors[practice.difficulty])}>
              {practice.difficulty}
            </span>
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
      >
        Start
      </Button>
    </Card>
  )
}

export function DailyPracticeDashboard() {
  const { variation, ready } = useExperiment()
  const { trackDashboardView, trackPracticeStart, trackPracticeComplete } = useEventTracking()
  const [codingPractices, setCodingPractices] = useState([])
  const [aptitudePractices, setAptitudePractices] = useState([])
  const [goals, setGoals] = useState([])
  const [completedGoals, setCompletedGoals] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [startingSession, setStartingSession] = useState(null)
  const [streak, setStreak] = useState(7)
  const [totalCompleted, setTotalCompleted] = useState(23)

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

  const handleCompletePractice = async (practice) => {
    const sessionId = `practice-${practice.id}`
    await trackPracticeComplete('coding', sessionId, 900)
    setTotalCompleted(prev => prev + 1)
    alert(`Completed: ${practice.title}! Great job!`)
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
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Daily Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{progress}%</p>
            </div>
            <ProgressRing progress={progress} size={60} strokeWidth={5} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Coding Streak</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{streak} days</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Flame className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Solved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCompleted}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>
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