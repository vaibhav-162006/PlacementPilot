import { useEffect } from 'react'
import { AuthGuard } from '@components/auth/AuthGuard.jsx'
import { Layout, PageHeader } from '@components/common/Layout.jsx'
import { DailyPracticeDashboard } from '@components/dashboard/DailyPracticeDashboard.jsx'
import { PersonalizedRoadmapDashboard } from '@components/dashboard/PersonalizedRoadmapDashboard.jsx'
import { useExperiment } from '@hooks/useFlagsmith.js'
import { LoadingSpinner } from '@components/common/LoadingSpinner.jsx'

function DashboardContent() {
  const { variation, loading, ready } = useExperiment()

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title={variation === 'daily_practice' ? 'Daily Practice Dashboard' : 'Personalized Roadmap Dashboard'}
        description={variation === 'daily_practice'
          ? 'Your daily coding challenges, aptitude questions, and practice goals'
          : 'Your weekly placement preparation roadmap with milestones and progress tracking'
        }
      />

      {variation === 'daily_practice' ? (
        <DailyPracticeDashboard />
      ) : (
        <PersonalizedRoadmapDashboard />
      )}
    </div>
  )
}

export function DashboardPage() {
  return (
    <AuthGuard>
      <Layout>
        <DashboardContent />
      </Layout>
    </AuthGuard>
  )
}