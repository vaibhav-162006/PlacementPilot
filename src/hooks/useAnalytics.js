import { useCallback } from 'react'
import {
  trackDashboardViewed,
  trackPracticeStarted,
  trackPracticeCompleted,
  trackRoadmapViewed,
  trackLearningGoalCompleted,
  getExperimentAnalytics,
  getUserPracticeStats,
} from '@services/analytics.js'

export function useEventTracking() {
  const trackDashboardView = useCallback(async () => {
    return await trackDashboardViewed()
  }, [])

  const trackPracticeStart = useCallback(async (sessionType, sessionId) => {
    return await trackPracticeStarted(sessionType, sessionId)
  }, [])

  const trackPracticeComplete = useCallback(async (sessionType, sessionId, durationSeconds) => {
    return await trackPracticeCompleted(sessionType, sessionId, durationSeconds)
  }, [])

  const trackRoadmapView = useCallback(async (weekNumber, milestoneId) => {
    return await trackRoadmapViewed(weekNumber, milestoneId)
  }, [])

  const trackGoalComplete = useCallback(async (goalId, weekNumber) => {
    return await trackLearningGoalCompleted(goalId, weekNumber)
  }, [])

  return {
    trackDashboardView,
    trackPracticeStart,
    trackPracticeComplete,
    trackRoadmapView,
    trackGoalComplete,
  }
}

export function useExperimentAnalytics() {
  const fetchAnalytics = useCallback(async () => {
    return await getExperimentAnalytics()
  }, [])

  const fetchUserStats = useCallback(async (userId, variation) => {
    return await getUserPracticeStats(userId, variation)
  }, [])

  return { fetchAnalytics, fetchUserStats }
}