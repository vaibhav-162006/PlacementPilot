import { Button } from '@components/common/Button.jsx'
import { ArrowRight, CheckCircle2, BookOpen, Target, Zap, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const patternSvg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#3b82f6" fill-opacity="0.03"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>`
const patternUrl = `data:image/svg+xml,${encodeURIComponent(patternSvg)}`

export function Hero() {
  const features = [
    { icon: BookOpen, title: 'Structured Learning', desc: 'Step-by-step roadmap tailored for placement preparation' },
    { icon: Target, title: 'Daily Practice', desc: 'Fresh coding challenges and aptitude questions every day' },
    { icon: Zap, title: 'Progress Tracking', desc: 'Visual analytics to monitor your improvement over time' },
    { icon: Shield, title: 'Experiment Powered', desc: 'A/B tested dashboards for optimal learning experience' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white py-20 lg:py-32">
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `url(${patternUrl})` }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Flagsmith Experimentation Hackathon Project
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight animate-slide-up">
            Master Your Placement Prep
            <br />
            <span className="text-primary-600">With Data-Driven Dashboards</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up">
            PlacementPilot uses Flagsmith feature flags to run a live A/B experiment comparing two
            dashboard experiences. Discover which approach helps you complete more practice sessions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/register">
              <Button size="lg" leftIcon={<BookOpen className="h-5 w-5" />} rightIcon={<ArrowRight className="h-5 w-5" />}>
                Start Your Journey Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="card p-6 text-center hover:shadow-card-hover transition-shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}