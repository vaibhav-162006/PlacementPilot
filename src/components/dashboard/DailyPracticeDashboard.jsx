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
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Button } from '@components/common/Button.jsx'
import { LoadingSpinner, SkeletonCard } from '@components/common/LoadingSpinner.jsx'
import { MOCK_PRACTICE_DATA, DAILY_GOALS } from '@utils/constants.js'
import { useExperiment } from '@hooks/useFlagsmith.js'
import { useEventTracking } from '@hooks/useAnalytics.js'
import { Section, ContentCard, GoalCard, PracticeCard, StatCard } from '@components/common/Section.jsx'
import { ProgressRing } from '@components/common/ProgressRing.jsx'

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
        <div className="stats-grid">
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
      <div className="stats-grid">
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
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 3.5a2.5 2.5 0 0 1 5 0"/><path d="M15 5a3.5 3.5 0 1 0-7 0 4 4 0 1 0 7 0Z"/><path d="M12 14l-3 3 3 3"/></svg>}
          iconBg="bg-warning/10"
          iconColor="text-warning"
          trend="Keep it up! 🔥"
        />
        <StatCard
          title="Total Solved"
          value={totalCompleted}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
          iconBg="bg-success/10"
          iconColor="text-success"
          trend="+3 this week"
          trendPositive
        />
        <StatCard
          title="This Week"
          value="12"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 8.5 15.5 5 12 1 8 6 16 17.5 6"/></svg>}
          iconBg="bg-action/10"
          iconColor="text-action"
          trend="On track"
          trendPositive
        />
      </div>

      {/* Daily Goals */}
      <Section
        title="Today's Goals"
        description="Complete these daily targets to maintain your streak"
      >
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              completed={completedGoals.has(goal.id)}
              onToggle={() => handleToggleGoal(goal.id)}
            />
          ))}
        </div>
      </Section>

      {/* Coding Practice */}
      <Section
        title="Daily Coding Challenges"
        description="Fresh problems every day to sharpen your skills"
        action={
          <button className="btn-ghost btn-base px-3 py-1.5 text-xs" leftIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>}>
            Refresh
          </button>
        }
      >
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
      </Section>

      {/* Aptitude Practice */}
      <Section
        title="Daily Aptitude Questions"
        description="Quantitative aptitude practice for placement tests"
      >
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
      </Section>

      {/* Quick Actions */}
      <Section title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="btn-secondary btn-base justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Random Problem</button>
          <button className="btn-secondary btn-base justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Aptitude Quiz</button>
          <button className="btn-secondary btn-base justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Mock Test</button>
          <button className="btn-secondary btn-base justify-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> View Solutions</button>
        </div>
      </Section>
    </div>
  )
}