import { createFlagsmithInstance } from '@flagsmith/flagsmith'

const environmentId = import.meta.env.VITE_FLAGSMSITH_ENVIRONMENT_ID

if (!environmentId) {
  console.warn('Flagsmith environment ID not configured. Please set VITE_FLAGSMSITH_ENVIRONMENT_ID in .env.local')
}

let flagsmithInstance = null

// REST API fallback for flag evaluation
async function fetchFlagViaAPI(userId) {
  try {
    const response = await fetch(`https://api.flagsmith.com/api/v1/identities/?identifier=${encodeURIComponent(userId)}`, {
      headers: {
        'X-Environment-Key': environmentId,
      },
    })
    if (!response.ok) throw new Error('Failed to fetch identity')
    const data = await response.json()
    const flag = data.flags?.find(f => f.feature?.name === 'placement_dashboard_experiment')
    if (flag?.feature_state_value) {
      const value = typeof flag.feature_state_value === 'string'
        ? JSON.parse(flag.feature_state_value)
        : flag.feature_state_value
      return value.dashboardType || flag.variant
    }
    return 'daily_practice'
  } catch (error) {
    console.error('[Flagsmith] API fetch error:', error)
    return 'daily_practice'
  }
}

export function initFlagsmith(userId, traits = {}) {
  if (flagsmithInstance) {
    flagsmithInstance.close()
  }

  flagsmithInstance = createFlagsmithInstance({
    environmentID: environmentId,
    identity: userId,
    traits,
    cacheFlags: true,
    enableAnalytics: true,
    enableEvents: true, // Enable events pipeline for experimentation
    realtime: false,
    api: 'https://api.flagsmith.com/api/v1',
    enableLogs: true,
    onChange: (oldFlags, params) => {
      console.log('[Flagsmith] Flags changed:', params)
    },
    onError: (error) => {
      console.error('[Flagsmith] Error:', error)
    },
  })

  return flagsmithInstance
}

export function getFlagsmith() {
  return flagsmithInstance
}

export async function getVariation(userId, traits = {}) {
  if (!flagsmithInstance) {
    initFlagsmith(userId, traits)
  }

  try {
    // Explicitly initialize the SDK (required for proper flag loading)
    await flagsmithInstance.init({
      environmentID: environmentId,
      identity: userId,
      traits,
    })

    await flagsmithInstance.identify(userId, traits)

    const hasFeature = flagsmithInstance.hasFeature('placement_dashboard_experiment')
    const value = flagsmithInstance.getValue('placement_dashboard_experiment')

    console.log('[Flagsmith] Flag evaluation:', { hasFeature, value, userId })

    if (hasFeature && value) {
      return value.dashboardType || value
    }

    // Fallback to REST API if SDK doesn't have the flag yet
    console.log('[Flagsmith] SDK evaluation returned nothing, falling back to REST API')
    return await fetchFlagViaAPI(userId)
  } catch (error) {
    console.error('[Flagsmith] Error getting variation:', error)
    return 'daily_practice'
  }
}

export function getFlagValue(flagKey) {
  if (!flagsmithInstance) return null
  return flagsmithInstance.getValue(flagKey)
}

export function hasFeature(flagKey) {
  if (!flagsmithInstance) return false
  return flagsmithInstance.hasFeature(flagKey)
}

export function getTrait(key) {
  if (!flagsmithInstance) return null
  return flagsmithInstance.getTrait(key)
}

export function setTrait(key, value) {
  if (!flagsmithInstance) return
  flagsmithInstance.setTrait(key, value)
}

/**
 * Track an event with Flagsmith for experimentation
 * @param {string} eventName - Event name (must match metric definition, e.g., 'practice_completed')
 * @param {object} opts - Optional: value, traits, metadata
 */
export function trackEvent(eventName, opts = {}) {
  if (!flagsmithInstance) {
    console.warn('[Flagsmith] Instance not initialized, cannot track event:', eventName)
    return
  }

  try {
    // For experimentation, the event name must match the metric definition exactly
    flagsmithInstance.trackEvent(eventName, {
      identifier: opts.identifier,
      traits: opts.traits,
      metadata: {
        variation: opts.variation,
        ...opts.metadata
      }
    })
  } catch (error) {
    console.error('[Flagsmith] Error tracking event:', error)
  }
}

/**
 * Track experiment exposure (when user sees a variation)
 * @param {string} flagKey - The multivariate flag key
 * @param {string} variationKey - The variant key user was assigned to
 */
export function trackExposure(flagKey, variationKey) {
  if (!flagsmithInstance) return
  try {
    flagsmithInstance.trackEvent('experiment_exposure', {
      metadata: {
        flag_key: flagKey,
        variation_key: variationKey
      }
    })
  } catch (error) {
    console.error('[Flagsmith] Error tracking exposure:', error)
  }
}

/**
 * Flush buffered events to Flagsmith
 * Call before page unload or app exit
 */
export async function flushEvents() {
  if (!flagsmithInstance) return

  try {
    await flagsmithInstance.flushEvents()
  } catch (error) {
    console.error('[Flagsmith] Error flushing events:', error)
  }
}

/**
 * Close Flagsmith client and flush events
 * @param {number} timeoutMs - Max time to wait for flush
 */
export async function closeFlagsmith(timeoutMs = 5000) {
  if (!flagsmithInstance) return

  try {
    await flagsmithInstance.close(timeoutMs)
  } catch (error) {
    console.error('[Flagsmith] Error closing:', error)
  }
}

export function destroyFlagsmith() {
  if (flagsmithInstance) {
    flagsmithInstance.close()
    flagsmithInstance = null
  }
}

export function isFlagsmithReady() {
  return flagsmithInstance !== null && flagsmithInstance.loadingState?.isLoading === false
}

export async function waitForFlagsmith(timeout = 3000) {
  if (!flagsmithInstance) return false

  return new Promise((resolve) => {
    // Check if already loaded
    const state = flagsmithInstance.loadingState
    console.log('[waitForFlagsmith] Initial state:', state)
    if (state?.isLoading === false) {
      resolve(true)
      return
    }

    const interval = setInterval(() => {
      const s = flagsmithInstance.loadingState
      if (s?.isLoading === false) {
        clearInterval(interval)
        clearTimeout(timeoutId)
        resolve(true)
      }
    }, 200)

    const timeoutId = setTimeout(() => {
      clearInterval(interval)
      console.log('[waitForFlagsmith] Timeout, using fallback')
      resolve(false)
    }, timeout)
  })
}