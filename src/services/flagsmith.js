import flagsmith, { createFlagsmithInstance } from '@flagsmith/flagsmith'

const environmentId = import.meta.env.VITE_FLAGSMSITH_ENVIRONMENT_ID

if (!environmentId) {
  console.warn('Flagsmith environment ID not configured. Please set VITE_FLAGSMSITH_ENVIRONMENT_ID in .env.local')
}

let flagsmithInstance = null

export function initFlagsmith(userId, traits = {}) {
  if (flagsmithInstance) {
    flagsmithInstance.destroy()
  }

  flagsmithInstance = createFlagsmithInstance({
    environmentID: environmentId,
    identity: userId,
    traits,
    cacheFlags: true,
    enableAnalytics: true,
    onChange: (oldFlags, params) => {
      console.log('[Flagsmith] Flags changed:', params)
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
    await flagsmithInstance.identify(userId, traits)

    const hasFeature = flagsmithInstance.hasFeature('placement_dashboard_experiment')
    const value = flagsmithInstance.getValue('placement_dashboard_experiment')

    console.log('[Flagsmith] Flag evaluation:', { hasFeature, value, userId })

    if (hasFeature && value) {
      return value.dashboardType || value
    }

    return 'daily_practice'
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

export function destroyFlagsmith() {
  if (flagsmithInstance) {
    flagsmithInstance.destroy()
    flagsmithInstance = null
  }
}

export function isFlagsmithReady() {
  return flagsmithInstance !== null && flagsmithInstance.initialised
}

export async function waitForFlagsmith(timeout = 5000) {
  if (!flagsmithInstance) return false

  return new Promise((resolve) => {
    const checkReady = () => {
      if (flagsmithInstance.initialised) {
        resolve(true)
      }
    }

    if (flagsmithInstance.initialised) {
      resolve(true)
      return
    }

    const interval = setInterval(() => {
      if (flagsmithInstance.initialised) {
        clearInterval(interval)
        clearTimeout(timeoutId)
        resolve(true)
      }
    }, 100)

    const timeoutId = setTimeout(() => {
      clearInterval(interval)
      resolve(false)
    }, timeout)
  })
}