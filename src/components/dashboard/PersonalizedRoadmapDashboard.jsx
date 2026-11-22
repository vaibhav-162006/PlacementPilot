import { useState, useEffect } from 'react'
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
import { Button } from '@components/common/Button.jsx'
import { SkeletonCard } from '@components/common/LoadingSpinner.jsx'
import { MOCK_ROADMAP_DATA } from '@utils/constants.js'
import { useExperiment } from '@hooks/useFlagsmith.js'
import { useEventTracking } from '@hooks/useAnalytics.js'
import { Section, ContentCard, GoalCard, WeekCard, MilestoneCard, StatCard } from '@components/common/Section.jsx'
import { ProgressRing } from '@components/common/ProgressRing.jsx'

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
          title="Overall Progress"
          value={`${overallProgress}%`}
          icon={<ProgressRing progress={overallProgress} size={56} strokeWidth={4} />}
          trend="+15% this month"
          trendPositive
        />
        <StatCard
          title="Current Week"
          value={`Week ${activeWeek}`}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06"/><path d="M22 22H2"/></svg>}
          iconBg="bg-action/10"
          iconColor="text-action"
          trend="On track"
          trendPositive
        />
        <StatCard
          title="Goals Completed"
          value={`${completedCount} / ${totalGoals}`}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
          iconBg="bg-success/10"
          iconColor="text-success"
          trend="+3 this week"
          trendPositive
        />
        <StatCard
          title="This Week Progress"
          value={`${currentWeekProgress}%`}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          iconBg="bg-warning/10"
          iconColor="text-warning"
          trend="Keep pushing!"
        />
      </div>

      {/* Current Week Focus */}
      <div className="card-base relative overflow-hidden bg-gradient-to-r from-action/5 via-action/10 to-warning/5 border-action/20 p-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%230D9488%22 fill-opacity%3D%220.03%22%3E%3Cpath d%3D%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1 pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-action/10 text-action text-sm font-medium mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-action/75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-action"></span>
              </span>
              Current Focus
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">{currentWeek?.title}</h3>
            <p className="text-muted-foreground mt-1 max-w-xl">{currentWeek?.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <ProgressRing progress={currentWeekProgress} size={60} strokeWidth={4} />
              <div>
                <p className="text-sm text-muted-foreground">Week Progress</p>
                <p className="font-display text-2xl font-bold text-action">{currentWeekProgress}%</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-action/30"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <Section title="Learning Milestones" description="Key checkpoints in your placement journey">
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={index}
              milestone={milestone}
              completed={index < activeWeek - 1 || (index === activeWeek - 1 && currentWeekProgress === 100)}
              index={index}
            />
          ))}
        </div>
      </Section>

      {/* Weekly Roadmap */}
      <Section
        title="Weekly Roadmap"
        description="Expand each week to see your learning goals"
      >
        <div className="space-y-3">
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
      </Section>

      {/* Recommended Resources */}
      <Section title="Recommended Resources">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ContentCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
            iconBg="bg-action/10"
            iconColor="text-action"
            title="LeetCode 75"
            description="Essential 75 problems for interview prep"
          />
          <ContentCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            iconBg="bg-success/10"
            iconColor="text-success"
            title="Quantitative Aptitude"
            description="Complete guide with shortcuts & tricks"
          />
          <ContentCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
            iconBg="bg-warning/10"
            iconColor="text-warning"
            title="System Design Primer"
            description="Learn to design scalable systems"
          />
        </div>
      </Section>
    </div>
  )
}