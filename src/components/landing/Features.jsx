import { Card, CardTitle, CardDescription } from '@components/common/Card.jsx'
import {
  Code,
  Calculator,
  BookOpen,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  BarChart3,
} from 'lucide-react'

const features = [
  {
    icon: Code,
    title: 'Daily Coding Challenges',
    description: 'Curated LeetCode-style problems delivered daily. Covers arrays, strings, linked lists, trees, graphs, and dynamic programming with progressive difficulty.',
    variation: 'daily_practice',
  },
  {
    icon: Calculator,
    title: 'Aptitude Practice',
    description: 'Quantitative aptitude questions for placement tests. Topics include percentages, ratios, time & work, profit & loss, simple & compound interest.',
    variation: 'daily_practice',
  },
  {
    icon: Target,
    title: 'Personalized Roadmap',
    description: 'Week-by-week learning path tailored to your target companies. Covers 4 weeks of structured preparation with milestones and checkpoints.',
    variation: 'personalized_roadmap',
  },
  {
    icon: BookOpen,
    title: 'Weekly Milestones',
    description: 'Clear learning objectives for each week. Track completion of coding topics, aptitude concepts, and system design fundamentals.',
    variation: 'personalized_roadmap',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visual dashboards showing completion rates, streaks, and skill progression. Compare your performance across different practice types.',
    variation: 'both',
  },
  {
    icon: BarChart3,
    title: 'Experiment Insights',
    description: 'See real-time A/B experiment results. Understand which dashboard variation drives better engagement and completion rates.',
    variation: 'both',
  },
]

const experimentInfo = {
  title: 'How the Experiment Works',
  description: 'PlacementPilot uses Flagsmith to run a live multivariate experiment. Half the users see the Daily Practice dashboard, half see the Personalized Roadmap. We measure practice completion rates to determine which approach is more effective.',
  variations: [
    {
      name: 'Variation A: Daily Practice',
      description: 'Focus on daily habits with coding challenges, aptitude questions, and daily goals. Designed for consistent daily engagement.',
      icon: Zap,
    },
    {
      name: 'Variation B: Personalized Roadmap',
      description: 'Structured weekly learning path with milestones, progress tracking, and recommended resources. Designed for strategic long-term preparation.',
      icon: Trophy,
    },
  ],
}

export function Features() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Two Experiences, One Goal
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We're testing which dashboard design helps students complete more practice sessions.
            Your experience is randomly assigned as part of our Flagsmith experiment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 hover:shadow-card-hover transition-shadow h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
              <div className="mt-4 flex items-center gap-2">
                <span className="badge badge-primary text-xs">
                  {feature.variation === 'daily_practice' ? 'Daily Practice' : feature.variation === 'personalized_roadmap' ? 'Roadmap' : 'Both'}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Experiment Info */}
        <div className="card p-6 md:p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900">{experimentInfo.title}</h3>
              <p className="mt-3 text-gray-600">{experimentInfo.description}</p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {experimentInfo.variations.map((variation) => (
                <Card key={variation.name} className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <variation.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{variation.name}</h4>
                  </div>
                  <p className="text-gray-600">{variation.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}