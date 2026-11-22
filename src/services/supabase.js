import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export async function signUp(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

export async function createProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...profileData })
    .select()
    .single()
  return { data, error }
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function trackEvent(userId, eventName, variation, metadata = {}) {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_name: eventName,
      variation,
      metadata,
    })
    .select()
    .single()
  return { data, error }
}

export async function getUserEvents(userId, eventName = null) {
  let query = supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (eventName) {
    query = query.eq('event_name', eventName)
  }

  const { data, error } = await query
  return { data, error }
}

export async function getAllEvents(filters = {}) {
  let query = supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters.variation) {
    query = query.eq('variation', filters.variation)
  }
  if (filters.eventName) {
    query = query.eq('event_name', filters.eventName)
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate)
  }
  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  return { data, error }
}

export async function createPracticeSession(userId, variation, sessionType, sessionId) {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({
      user_id: userId,
      variation,
      session_type: sessionType,
      session_id: sessionId,
    })
    .select()
    .single()
  return { data, error }
}

export async function completePracticeSession(userId, sessionId, variation) {
  const { data, error } = await supabase
    .from('practice_sessions')
    .update({
      completed_at: new Date().toISOString(),
      is_completed: true,
    })
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .eq('variation', variation)
    .select()
    .single()
  return { data, error }
}

export async function getPracticeSessions(userId, variation = null) {
  let query = supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (variation) {
    query = query.eq('variation', variation)
  }

  const { data, error } = await query
  return { data, error }
}

export async function getExperimentAssignment(userId) {
  const { data, error } = await supabase
    .from('experiment_assignments')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function createExperimentAssignment(userId, variation) {
  const { data, error } = await supabase
    .from('experiment_assignments')
    .insert({
      user_id: userId,
      variation,
      flagsmith_flag_key: 'placement_dashboard_experiment',
    })
    .select()
    .single()
  return { data, error }
}

export async function getAllExperimentAssignments() {
  const { data, error } = await supabase
    .from('experiment_assignments')
    .select('*, profiles(full_name, email)')
    .order('assigned_at', { ascending: false })
  return { data, error }
}

export async function getAnalyticsSummary() {
  const { data: assignments, error: assignmentsError } = await supabase
    .from('experiment_assignments')
    .select('variation')

  if (assignmentsError) return { data: null, error: assignmentsError }

  const { data: events, error: eventsError } = await supabase
    .from('analytics_events')
    .select('event_name, variation')

  if (eventsError) return { data: null, error: eventsError }

  const { data: sessions, error: sessionsError } = await supabase
    .from('practice_sessions')
    .select('variation, is_completed')

  if (sessionsError) return { data: null, error: sessionsError }

  return {
    data: {
      assignments: assignments || [],
      events: events || [],
      sessions: sessions || [],
    },
    error: null,
  }
}