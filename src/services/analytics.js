import * as supabaseService from '@services/supabase.js'
import { trackEvent as trackFlagsmithEvent, flushEvents as flushFlagsmithEvents } from '@services/flagsmith.js'
import { EVENT_NAMES, STORAGE_KEYS, EXPERIMENT_VARIATIONS } from '@utils/constants.js'
import { getSessionStorage, setSessionStorage, generateId } from '@utils/helpers.js'

let currentVariation = null
let currentUserId = null

export function setAnalyticsContext(userId, variation) {
  currentUserId = userId
  currentVariation = variation
}

export function getCurrentVariation() {
  return currentVariation
}

export function getCurrentUserId() {
  return currentUserId
}

async function track(eventName, metadata = {}) {
  if (!currentUserId || !currentVariation) {
    console.warn('[Analytics] No user context set, skipping event:', eventName)
    return { success: false, reason: 'no_context' }
  }

  try {
    // Track to Supabase (existing analytics)
    const { error } = await supabaseService.trackEvent(currentUserId, eventName, currentVariation, metadata)
    if (error) {
      console.error('[Analytics] Failed to track event to Supabase:', error)
      return { success: false, error }
    }

    // Track to Flagsmith for experimentation
    // The event name must match the metric definition exactly
    trackFlagsmithEvent(eventName, {
      identifier: currentUserId,
      metadata: {
        variation: currentVariation,
        ...metadata
      }
    })

    return { success: true }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error)
    return { success: false, error }
  }
}

export async function trackDashboardViewed() {
  const sessionKey = `${STORAGE_KEYS.DASHBOARD_VIEWED_SESSION}_${currentVariation}`
  const alreadyTracked = getSessionStorage(sessionKey)

  if (alreadyTracked) {
    return { success: true, deduplicated: true }
  }

  const result = await track(EVENT_NAMES.DASHBOARD_VIEWED, {
    page: 'dashboard',
    variation: currentVariation,
  })

  if (result.success) {
    setSessionStorage(sessionKey, true)
  }

  return result
}

export async function trackPracticeStarted(sessionType, sessionId = null) {
  const id = sessionId || generateId('session-')

  await supabaseService.createPracticeSession(currentUserId, currentVariation, sessionType, id)

  return track(EVENT_NAMES.PRACTICE_STARTED, {
    session_type: sessionType,
    session_id: id,
  })
}

export async function trackPracticeCompleted(sessionType, sessionId, durationSeconds = null) {
  await supabaseService.completePracticeSession(currentUserId, sessionId, currentVariation)

  return track(EVENT_NAMES.PRACTICE_COMPLETED, {
    session_type: sessionType,
    session_id: sessionId,
    duration_seconds: durationSeconds,
  })
}

export async function trackRoadmapViewed(weekNumber, milestoneId = null) {
  return track(EVENT_NAMES.ROADMAP_VIEWED, {
    week_number: weekNumber,
    milestone_id: milestoneId,
  })
}

export async function trackLearningGoalCompleted(goalId, weekNumber) {
  return track(EVENT_NAMES.LEARNING_GOAL_COMPLETED, {
    goal_id: goalId,
    week_number: weekNumber,
  })
}

export async function flushAnalyticsEvents() {
  await flushFlagsmithEvents()
}

export async function getUserPracticeStats(userId, variation) {
  const { data: sessions, error } = await supabaseService.getPracticeSessions(userId, variation)

  if (error || !sessions) {
    return { total: 0, completed: 0, completionRate: 0 }
  }

  const total = sessions.length
  const completed = sessions.filter(s => s.is_completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, completionRate }
}

export async function getExperimentAnalytics() {
  const { data, error } = await supabaseService.getAnalyticsSummary()

  if (error || !data) {
    return {
      totalParticipants: 0,
      variationA: { participants: 0, completionRate: 0 },
      variationB: { participants: 0, completionRate: 0 },
      events: [],
      dailyEngagement: [],
    }
  }

  const { assignments, events, sessions } = data

  const variationAAssignments = assignments.filter(a => a.variation === EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
  const variationBAssignments = assignments.filter(a => a.variation === EXPERIMENT_VARIATIONS.PERSONALIZED_ROADMAP)

  const variationASessions = sessions.filter(s => s.variation === EXPERIMENT_VARIATIONS.DAILY_PRACTICE)
  const variationBSessions = sessions.filter(s => s.variation === EXPERIMENT_VARIATIONS.PERSONALIZED_ROADMAP)

  const variationACompleted = variationASessions.filter(s => s.is_completed).length
  const variationBCompleted = variationBSessions.filter(s => s.is_completed).length

  const variationACompletionRate = variationASessions.length > 0
    ? Math.round((variationACompleted / variationASessions.length) * 100)
    : 0
  const variationBCompletionRate = variationBSessions.length > 0
    ? Math.round((variationBCompleted / variationBSessions.length) * 100)
    : 0

  const dailyEngagement = calculateDailyEngagement(events)

  return {
    totalParticipants: assignments.length,
    variationA: {
      participants: variationAAssignments.length,
      sessionsStarted: variationASessions.length,
      sessionsCompleted: variationACompleted,
      completionRate: variationACompletionRate,
    },
    variationB: {
      participants: variationBAssignments.length,
      sessionsStarted: variationBSessions.length,
      sessionsCompleted: variationBCompleted,
      completionRate: variationBCompletionRate,
    },
    events: events.slice(0, 100),
    dailyEngagement,
  }
}

function calculateDailyEngagement(events) {
  const dailyMap = new Map()

  events.forEach(event => {
    const date = new Date(event.created_at).toISOString().split('T')[0]
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { date, views: 0, starts: 0, completions: 0 })
    }
    const day = dailyMap.get(date)

    switch (event.event_name) {
      case EVENT_NAMES.DASHBOARD_VIEWED:
        day.views++
        break
      case EVENT_NAMES.PRACTICE_STARTED:
        day.starts++
        break
      case EVENT_NAMES.PRACTICE_COMPLETED:
      case EVENT_NAMES.LEARNING_GOAL_COMPLETED:
        day.completions++
        break
    }
  })

  return Array.from(dailyMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
}

export function resetAnalyticsContext() {
  currentUserId = null
  currentVariation = null
}