import { useState, useEffect } from 'react'
import { AdminGuard } from '@components/auth/AuthGuard.jsx'
import { Layout, PageHeader, SectionHeader } from '@components/common/Layout.jsx'
import { MetricCard } from '@components/analytics/MetricCard.jsx'
import {
  CompletionRateChart,
  DailyEngagementChart,
  ExperimentFunnelChart,
  VariationComparisonChart,
  PieChartComponent,
} from '@components/analytics/ExperimentChart.jsx'
import { ParticipantsTable, EventsTable } from '@components/analytics/ParticipantsTable.jsx'
import { getExperimentAnalytics } from '@services/analytics.js'
import { LoadingSpinner } from '@components/common/LoadingSpinner.jsx'
import { Card, CardBody } from '@components/common/Card.jsx'
import { Users, TrendingUp, BarChart3, Target, Clock, CheckCircle2 } from 'lucide-react'
import { EXPERIMENT_VARIATIONS } from '@utils/constants.js'
import { cn } from '@utils/helpers.js'

function AdminAnalyticsContent() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getExperimentAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadAnalytics()
  }

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const data = analytics || {
    totalParticipants: 0,
    variationA: { participants: 0, sessionsStarted: 0, sessionsCompleted: 0, completionRate: 0 },
    variationB: { participants: 0, sessionsStarted: 0, sessionsCompleted: 0, completionRate: 0 },
    events: [],
    dailyEngagement: [],
  }

  const winner = data.variationB.completionRate > data.variationA.completionRate ? 'B' : 'A'
  const winnerRate = winner === 'B' ? data.variationB.completionRate : data.variationA.completionRate
  const loserRate = winner === 'B' ? data.variationA.completionRate : data.variationB.completionRate
  const difference = winnerRate - loserRate

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Experiment Analytics"
          description="Real-time analytics for the PlacementPilot A/B experiment"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          <button onClick={handleRefresh} disabled={refreshing} className="btn-secondary">
            <svg className={cn('h-4 w-4', refreshing && 'animate-spin')} viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Experiment Status Banner */}
      <Card className={cn('border-primary-200 bg-primary-50', data.totalParticipants > 0 && 'border-success-200 bg-success-50')}>
        <CardBody>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {data.totalParticipants > 0 ? 'Experiment Running' : 'Experiment Ready'}
                </h3>
                <p className="text-sm text-gray-600">
                  {data.totalParticipants > 0
                    ? `${data.totalParticipants} participants • Variation ${winner} leading by ${difference}%`
                    : 'No participants yet. Share the app to start collecting data.'}
                </p>
              </div>
            </div>
            {data.totalParticipants > 0 && (
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-white border border-gray-200">
                  <p className="text-sm text-gray-500">Current Leader</p>
                  <p className="font-bold text-primary-600">Variation ${winner} ({winner === 'B' ? 'Roadmap' : 'Daily Practice'})</p>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Participants"
          value={data.totalParticipants}
          icon={<Users className="h-5 w-5" />}
          iconColor="primary"
        />
        <MetricCard
          title="Variation A (Daily Practice)"
          value={data.variationA.participants}
          change={data.variationA.completionRate}
          changeLabel="completion rate"
          icon={<Target className="h-5 w-5" />}
          iconColor="primary"
        />
        <MetricCard
          title="Variation B (Roadmap)"
          value={data.variationB.participants}
          change={data.variationB.completionRate}
          changeLabel="completion rate"
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="success"
        />
        <MetricCard
          title="Total Sessions"
          value={data.variationA.sessionsStarted + data.variationB.sessionsStarted}
          change={data.variationA.sessionsCompleted + data.variationB.sessionsCompleted}
          changeLabel="completed"
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconColor="purple"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8" aria-label="Analytics tabs">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'comparison', label: 'Comparison', icon: TrendingUp },
            { id: 'engagement', label: 'Engagement', icon: Clock },
            { id: 'participants', label: 'Participants', icon: Users },
            { id: 'events', label: 'Events', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompletionRateChart data={data} />
            <ExperimentFunnelChart data={data} />
          </div>
          <VariationComparisonChart data={data} />
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompletionRateChart data={data} />
            <VariationComparisonChart data={data} />
          </div>

          <SectionHeader title="Statistical Summary" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Variation A: Daily Practice</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Participants:</span><span className="font-medium">{data.variationA.participants}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sessions Started:</span><span className="font-medium">{data.variationA.sessionsStarted}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sessions Completed:</span><span className="font-medium">{data.variationA.sessionsCompleted}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Completion Rate:</span><span className="font-bold text-primary-600">{data.variationA.completionRate}%</span></div>
              </div>
            </Card>
            <Card className="p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Variation B: Personalized Roadmap</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Participants:</span><span className="font-medium">{data.variationB.participants}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sessions Started:</span><span className="font-medium">{data.variationB.sessionsStarted}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sessions Completed:</span><span className="font-medium">{data.variationB.sessionsCompleted}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Completion Rate:</span><span className="font-bold text-success-600">{data.variationB.completionRate}%</span></div>
              </div>
            </Card>
            <Card className="p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Experiment Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Total Participants:</span><span className="font-medium">{data.totalParticipants}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Leader:</span><span className="font-bold">{winner === 'A' ? 'Variation A' : 'Variation B'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Difference:</span><span className="font-bold text-primary-600">{difference}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Significance:</span><span className="font-medium text-gray-500">{data.totalParticipants > 100 ? 'Calculating...' : 'Need more data'}</span></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="space-y-6 animate-fade-in">
          <DailyEngagementChart data={data} />

          <SectionHeader title="Event Distribution" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartComponent
              data={[
                { name: 'Dashboard Viewed', value: data.events?.filter(e => e.event_name === 'dashboard_viewed').length || 0 },
                { name: 'Practice Started', value: data.events?.filter(e => e.event_name === 'practice_started').length || 0 },
                { name: 'Practice Completed', value: data.events?.filter(e => e.event_name === 'practice_completed').length || 0 },
                { name: 'Roadmap Viewed', value: data.events?.filter(e => e.event_name === 'roadmap_viewed').length || 0 },
                { name: 'Goal Completed', value: data.events?.filter(e => e.event_name === 'learning_goal_completed').length || 0 },
              ]}
              title="All Events"
              dataKey="value"
              nameKey="name"
            />
            <PieChartComponent
              data={[
                { name: 'Variation A', value: data.events?.filter(e => e.variation === EXPERIMENT_VARIATIONS.DAILY_PRACTICE).length || 0 },
                { name: 'Variation B', value: data.events?.filter(e => e.variation === EXPERIMENT_VARIATIONS.PERSONALIZED_ROADMAP).length || 0 },
              ]}
              title="Events by Variation"
              dataKey="value"
              nameKey="name"
              colors={['#3b82f6', '#22c55e']}
            />
          </div>
        </div>
      )}

      {activeTab === 'participants' && (
        <ParticipantsTable
          participants={data.assignments}
          loading={loading}
        />
      )}

      {activeTab === 'events' && (
        <EventsTable
          events={data.events}
          loading={loading}
        />
      )}
    </div>
  )
}

export function AdminAnalyticsPage() {
  return (
    <AdminGuard>
      <Layout>
        <AdminAnalyticsContent />
      </Layout>
    </AdminGuard>
  )
}