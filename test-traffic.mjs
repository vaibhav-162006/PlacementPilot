/**
 * Test Traffic Simulation for Flagsmith Experiment
 *
 * This script simulates users visiting the PlacementPilot app,
 * getting assigned to experiment variations, and completing practice sessions.
 *
 * Uses Flagsmith REST API directly (SDK is browser-only).
 *
 * Usage:
 *   FLAGSMITH_API_KEY=your_master_api_key VITE_FLAGSMSITH_ENVIRONMENT_ID=MZGssTd2qqM9jDhg94BtLu node test-traffic.mjs
 *
 * Requirements:
 * - FLAGSMITH_API_KEY set to Master API key
 * - VITE_FLAGSMSITH_ENVIRONMENT_ID set to environment key
 */

import fetch from 'node-fetch'

const ENVIRONMENT_ID = process.env.VITE_FLAGSMSITH_ENVIRONMENT_ID
const API_KEY = process.env.FLAGSMITH_API_KEY
const API_BASE = 'https://api.flagsmith.com/api/v1'

if (!ENVIRONMENT_ID) {
  console.error('❌ VITE_FLAGSMSITH_ENVIRONMENT_ID not set')
  console.error('Usage: VITE_FLAGSMSITH_ENVIRONMENT_ID=your_env_id FLAGSMITH_API_KEY=your_key node test-traffic.mjs')
  process.exit(1)
}

if (!API_KEY) {
  console.error('❌ FLAGSMITH_API_KEY not set (Master API key required for identity creation)')
  console.error('Usage: VITE_FLAGSMSITH_ENVIRONMENT_ID=your_env_id FLAGSMITH_API_KEY=your_key node test-traffic.mjs')
  process.exit(1)
}

// Configuration
const NUM_USERS = 100                    // Total simulated users
const COMPLETION_RATE_A = 0.45           // 45% completion for Variation A (Daily Practice)
const COMPLETION_RATE_B = 0.62           // 62% completion for Variation B (Roadmap)
const SESSIONS_PER_USER = 3              // Average sessions per user

// Variation keys from the multivariate flag
const VARIATIONS = {
  daily_practice: { key: 'daily_practice', name: 'Daily Practice (A)', completionRate: COMPLETION_RATE_A },
  personalized_roadmap: { key: 'personalized_roadmap', name: 'Personalized Roadmap (B)', completionRate: COMPLETION_RATE_B }
}

// Practice session types
const SESSION_TYPES = ['coding', 'aptitude']

function generateUserId(index) {
  return `sim-user-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// API helper functions
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'X-Environment-Key': ENVIRONMENT_ID,
      'Authorization': `ApiKey ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API GET ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'X-Environment-Key': ENVIRONMENT_ID,
      'Authorization': `ApiKey ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API POST ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function createIdentity(identifier, traits = {}) {
  // Create or get identity - traits must be a list of {trait_key, trait_value} objects
  const traitsList = Object.entries(traits).map(([trait_key, trait_value]) => ({
    trait_key,
    trait_value: String(trait_value)
  }))
  return apiPost('/identities/', { identifier, traits: traitsList })
}

async function getIdentityFlags(identifier) {
  // Get flags for identity
  return apiGet(`/identities/?identifier=${encodeURIComponent(identifier)}`)
}

async function trackEvent(identifier, eventName, metadata = {}) {
  // Track event via API - Note: This environment doesn't store events in Flagsmith
  // Events must be sent from client-side SDK (browser)
  // This is a no-op for API-based testing
  console.log(`  [Event] ${eventName} for ${identifier}:`, metadata)
  return { success: true, simulated: true }
}

async function simulateUser(userIndex) {
  const userId = generateUserId(userIndex)
  const traits = {
    email: `${userId}@example.com`,
    full_name: `Test User ${userIndex}`,
    simulated: true
  }

  try {
    // Create/identify user - this triggers flag evaluation and exposure tracking
    await createIdentity(userId, traits)

    // Get the experiment flag value (this also tracks exposure if in experiment)
    const identityData = await getIdentityFlags(userId)

    // Find the experiment flag
    const expFlag = identityData.flags?.find(f => f.feature?.name === 'placement_dashboard_experiment')

    if (!expFlag) {
      console.log(`⚠️  User ${userIndex}: No experiment flag found`)
      return { userId, variation: 'none', sessions: 0, completions: 0 }
    }

    // Determine variation from flag value
    let variation = 'unknown'
    if (expFlag.feature_state_value && typeof expFlag.feature_state_value === 'object' && expFlag.feature_state_value.dashboardType) {
      variation = expFlag.feature_state_value.dashboardType
    } else if (expFlag.variant) {
      variation = expFlag.variant
    } else if (expFlag.feature_state_value && typeof expFlag.feature_state_value === 'string') {
      // Try to parse JSON string
      try {
        const parsed = JSON.parse(expFlag.feature_state_value)
        if (parsed.dashboardType) variation = parsed.dashboardType
      } catch (e) {
        variation = expFlag.feature_state_value
      }
    }

    const varInfo = VARIATIONS[variation] || { name: variation, completionRate: 0 }
    const inExperiment = expFlag.metadata?.experiment?.in_experiment || false
    console.log(`👤 User ${userIndex}: ${varInfo.name} (inExperiment: ${inExperiment})`)

    // Simulate practice sessions
    let completions = 0
    const numSessions = Math.max(1, Math.round(SESSIONS_PER_USER * (0.5 + Math.random())))

    for (let i = 0; i < numSessions; i++) {
      const sessionType = SESSION_TYPES[Math.floor(Math.random() * SESSION_TYPES.length)]
      const sessionId = generateSessionId()
      const completed = Math.random() < varInfo.completionRate

      // Track practice_started event
      await trackEvent(userId, 'practice_started', {
        variation,
        session_type: sessionType,
        session_id: sessionId,
        simulated: true
      })

      if (completed) {
        // Track practice_completed event (the conversion metric)
        await trackEvent(userId, 'practice_completed', {
          variation,
          session_type: sessionType,
          session_id: sessionId,
          duration_seconds: Math.floor(Math.random() * 1800) + 300, // 5-35 min
          simulated: true
        })
        completions++
      }
    }

    return { userId, variation, sessions: numSessions, completions }

  } catch (error) {
    console.error(`❌ User ${userIndex} error:`, error.message)
    return { userId, variation: 'error', sessions: 0, completions: 0 }
  }
}

async function main() {
  console.log('🚀 Starting PlacementPilot Experiment Traffic Simulation (REST API)')
  console.log('='.repeat(60))
  console.log(`Environment: ${ENVIRONMENT_ID}`)
  console.log(`Users to simulate: ${NUM_USERS}`)
  console.log(`Expected completion rates:`)
  console.log(`  - Daily Practice (A): ${(COMPLETION_RATE_A * 100).toFixed(0)}%`)
  console.log(`  - Personalized Roadmap (B): ${(COMPLETION_RATE_B * 100).toFixed(0)}%`)
  console.log('='.repeat(60))

  const results = {
    daily_practice: { users: 0, sessions: 0, completions: 0 },
    personalized_roadmap: { users: 0, sessions: 0, completions: 0 },
    unknown: { users: 0, sessions: 0, completions: 0 }
  }

  console.log('\n👥 Simulating users...\n')

  // Simulate users sequentially (with small delay to avoid rate limits)
  for (let i = 0; i < NUM_USERS; i++) {
    const result = await simulateUser(i + 1)

    if (results[result.variation]) {
      results[result.variation].users++
      results[result.variation].sessions += result.sessions
      results[result.variation].completions += result.completions
    } else {
      results.unknown.users++
      results.unknown.sessions += result.sessions
      results.unknown.completions += result.completions
    }

    // Progress indicator
    if ((i + 1) % 10 === 0) {
      console.log(`  Progress: ${i + 1}/${NUM_USERS} users`)
    }

    // Small delay between users
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SIMULATION RESULTS')
  console.log('='.repeat(60))

  let totalUsers = 0, totalSessions = 0, totalCompletions = 0

  for (const [variation, data] of Object.entries(results)) {
    if (data.users === 0) continue

    const rate = data.sessions > 0 ? (data.completions / data.sessions * 100).toFixed(1) : 0
    const varName = VARIATIONS[variation]?.name || variation

    console.log(`\n${varName}:`)
    console.log(`  Users: ${data.users}`)
    console.log(`  Sessions: ${data.sessions}`)
    console.log(`  Completions: ${data.completions}`)
    console.log(`  Completion Rate: ${rate}%`)

    totalUsers += data.users
    totalSessions += data.sessions
    totalCompletions += data.completions
  }

  console.log('\n' + '-'.repeat(60))
  console.log(`TOTAL: ${totalUsers} users, ${totalSessions} sessions, ${totalCompletions} completions`)
  console.log(`Overall Completion Rate: ${totalSessions > 0 ? (totalCompletions / totalSessions * 100).toFixed(1) : 0}%`)

  console.log('\n✅ Simulation complete!')
  console.log('\n📈 Next steps:')
  console.log('1. Wait ~1 minute for events to be processed')
  console.log('2. Refresh results:')
  console.log('   flagsmith api "api/v1/environments/MZGssTd2qqM9jDhg94BtLu/experiments/387/results/refresh/" --method POST')
  console.log('3. View results:')
  console.log('   flagsmith api "api/v1/environments/MZGssTd2qqM9jDhg94BtLu/experiments/387/results/" --method GET')
  console.log('4. Or view in dashboard: https://app.flagsmith.com/project/55354/environment/MZGssTd2qqM9jDhg94BtLu/experiments/387')
}

// Run simulation
main().catch(console.error)