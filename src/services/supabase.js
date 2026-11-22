import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Demo mode: if Supabase not configured, use mock client
const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-ref')

if (isDemoMode) {
  console.log('[Supabase] Running in DEMO MODE - using mock client')
}

export const supabase = isDemoMode ? null : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Mock storage for demo mode
const mockStorage = {
  users: new Map(),
  profiles: new Map(),
  sessions: new Map(),
  assignments: new Map(),
  events: [],
  currentUserId: null,
  authCallback: null,
}

function generateId() {
  return `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function createMockUser(email, metadata = {}) {
  const id = generateId()
  const user = { id, email, user_metadata: metadata, created_at: new Date().toISOString() }
  mockStorage.users.set(id, user)
  mockStorage.currentUserId = id
  return user
}

function getMockUser(id) {
  return mockStorage.users.get(id)
}

function fireAuthCallback(event, session) {
  if (mockStorage.authCallback) {
    mockStorage.authCallback(event, session)
  }
}

// Demo mode implementations
export async function signUp(email, password, metadata = {}) {
  if (isDemoMode) {
    const user = createMockUser(email, metadata)
    await createProfile(user.id, { email, ...metadata })
    fireAuthCallback('SIGNED_IN', { user })
    return { data: { user }, error: null }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
  return { data, error }
}

export async function signIn(email, password) {
  if (isDemoMode) {
    // Find existing user or create new
    let user = Array.from(mockStorage.users.values()).find(u => u.email === email)
    if (!user) {
      user = createMockUser(email)
      await createProfile(user.id, { email })
    } else {
      mockStorage.currentUserId = user.id
    }
    fireAuthCallback('SIGNED_IN', { user })
    return { data: { user }, error: null }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  if (isDemoMode) {
    mockStorage.currentUserId = null
    fireAuthCallback('SIGNED_OUT', null)
    return { error: null }
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  if (isDemoMode) {
    const userId = mockStorage.currentUserId
    if (userId) {
      const user = getMockUser(userId)
      return { data: { session: { user } }, error: null }
    }
    return { data: { session: null }, error: null }
  }
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getUser() {
  if (isDemoMode) {
    const userId = mockStorage.currentUserId
    if (userId) {
      const user = getMockUser(userId)
      return { data: { user }, error: null }
    }
    return { data: { user: null }, error: null }
  }
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export function onAuthStateChange(callback) {
  if (isDemoMode) {
    mockStorage.authCallback = callback
    // Fire initial session check
    setTimeout(() => {
      const userId = mockStorage.currentUserId
      if (userId) {
        const user = getMockUser(userId)
        callback('INITIAL_SESSION', { user })
      } else {
        callback('INITIAL_SESSION', null)
      }
    }, 0)
    return {
      data: {
        subscription: {
          unsubscribe: () => { mockStorage.authCallback = null },
        },
      },
    }
  }
  return supabase.auth.onAuthStateChange(callback)
}

export async function createProfile(userId, profileData) {
  if (isDemoMode) {
    const profile = { id: userId, ...profileData, created_at: new Date().toISOString() }
    mockStorage.profiles.set(userId, profile)
    return { data: profile, error: null }
  }
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...profileData })
    .select()
    .single()
  return { data, error }
}

export async function getProfile(userId) {
  if (isDemoMode) {
    const profile = mockStorage.profiles.get(userId)
    return { data: profile || null, error: null }
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId, updates) {
  if (isDemoMode) {
    const profile = mockStorage.profiles.get(userId)
    if (profile) {
      const updated = { ...profile, ...updates, updated_at: new Date().toISOString() }
      mockStorage.profiles.set(userId, updated)
      return { data: updated, error: null }
    }
    return { data: null, error: { message: 'Profile not found' } }
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function trackEvent(userId, eventName, variation, metadata = {}) {
  if (isDemoMode) {
    const event = {
      id: generateId(),
      user_id: userId,
      event_name: eventName,
      variation,
      metadata,
      created_at: new Date().toISOString(),
    }
    mockStorage.events.push(event)
    console.log('[Demo] Tracked event:', eventName, { variation, metadata })
    return { data: event, error: null }
  }
  const { data, error } = await supabase
    .from('analytics_events')
    .insert({ user_id: userId, event_name: eventName, variation, metadata })
    .select()
    .single()
  return { data, error }
}

export async function getUserEvents(userId, eventName = null) {
  if (isDemoMode) {
    let events = mockStorage.events.filter(e => e.user_id === userId)
    if (eventName) events = events.filter(e => e.event_name === eventName)
    return { data: events, error: null }
  }
  let query = supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (eventName) query = query.eq('event_name', eventName)
  const { data, error } = await query
  return { data, error }
}

export async function getAllEvents(filters = {}) {
  if (isDemoMode) {
    let events = [...mockStorage.events]
    if (filters.variation) events = events.filter(e => e.variation === filters.variation)
    if (filters.eventName) events = events.filter(e => e.event_name === filters.eventName)
    if (filters.startDate) events = events.filter(e => e.created_at >= filters.startDate)
    if (filters.endDate) events = events.filter(e => e.created_at <= filters.endDate)
    if (filters.limit) events = events.slice(0, filters.limit)
    return { data: events, error: null }
  }
  let query = supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
  if (filters.variation) query = query.eq('variation', filters.variation)
  if (filters.eventName) query = query.eq('event_name', filters.eventName)
  if (filters.startDate) query = query.gte('created_at', filters.startDate)
  if (filters.endDate) query = query.lte('created_at', filters.endDate)
  if (filters.limit) query = query.limit(filters.limit)
  const { data, error } = await query
  return { data, error }
}

export async function createPracticeSession(userId, variation, sessionType, sessionId) {
  if (isDemoMode) {
    const session = {
      id: generateId(),
      user_id: userId,
      variation,
      session_type: sessionType,
      session_id: sessionId,
      started_at: new Date().toISOString(),
      is_completed: false,
    }
    mockStorage.sessions.set(sessionId, session)
    return { data: session, error: null }
  }
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({ user_id: userId, variation, session_type: sessionType, session_id: sessionId })
    .select()
    .single()
  return { data, error }
}

export async function completePracticeSession(userId, sessionId, variation) {
  if (isDemoMode) {
    const session = mockStorage.sessions.get(sessionId)
    if (session) {
      session.is_completed = true
      session.completed_at = new Date().toISOString()
      return { data: session, error: null }
    }
    return { data: null, error: { message: 'Session not found' } }
  }
  const { data, error } = await supabase
    .from('practice_sessions')
    .update({ completed_at: new Date().toISOString(), is_completed: true })
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .eq('variation', variation)
    .select()
    .single()
  return { data, error }
}

export async function getPracticeSessions(userId, variation = null) {
  if (isDemoMode) {
    let sessions = Array.from(mockStorage.sessions.values()).filter(s => s.user_id === userId)
    if (variation) sessions = sessions.filter(s => s.variation === variation)
    return { data: sessions, error: null }
  }
  let query = supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
  if (variation) query = query.eq('variation', variation)
  const { data, error } = await query
  return { data, error }
}

export async function getExperimentAssignment(userId) {
  if (isDemoMode) {
    const assignment = mockStorage.assignments.get(userId)
    return { data: assignment || null, error: null }
  }
  const { data, error } = await supabase
    .from('experiment_assignments')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function createExperimentAssignment(userId, variation) {
  if (isDemoMode) {
    const assignment = {
      id: generateId(),
      user_id: userId,
      variation,
      flagsmith_flag_key: 'placement_dashboard_experiment',
      assigned_at: new Date().toISOString(),
    }
    mockStorage.assignments.set(userId, assignment)
    return { data: assignment, error: null }
  }
  const { data, error } = await supabase
    .from('experiment_assignments')
    .insert({ user_id: userId, variation, flagsmith_flag_key: 'placement_dashboard_experiment' })
    .select()
    .single()
  return { data, error }
}

export async function getAllExperimentAssignments() {
  if (isDemoMode) {
    const assignments = Array.from(mockStorage.assignments.values()).map(a => ({
      ...a,
      profiles: mockStorage.profiles.get(a.user_id) || { full_name: 'Demo User', email: 'demo@example.com' }
    }))
    return { data: assignments, error: null }
  }
  const { data, error } = await supabase
    .from('experiment_assignments')
    .select('*, profiles(full_name, email)')
    .order('assigned_at', { ascending: false })
  return { data, error }
}

export async function getAnalyticsSummary() {
  if (isDemoMode) {
    const assignments = Array.from(mockStorage.assignments.values())
    const events = [...mockStorage.events]
    const sessions = Array.from(mockStorage.sessions.values())
    return {
      data: { assignments, events, sessions },
      error: null,
    }
  }
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
    data: { assignments: assignments || [], events: events || [], sessions: sessions || [] },
    error: null,
  }
}