import { useFlagsmith } from '@contexts/FlagsmithContext.jsx'

export function useExperiment() {
  const { variation, loading, error, ready, isDailyPractice, isPersonalizedRoadmap, refreshVariation } = useFlagsmith()
  return { variation, loading, error, ready, isDailyPractice, isPersonalizedRoadmap, refreshVariation }
}