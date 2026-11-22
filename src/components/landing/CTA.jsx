import { Button } from '@components/common/Button.jsx'
import { ArrowRight, Users, CheckCircle2, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CTA() {
  const stats = [
    { value: '500+', label: 'Practice Problems' },
    { value: '4', label: 'Weeks Roadmap' },
    { value: '2', label: 'Dashboard Variations' },
    { value: '100%', label: 'Free to Use' },
  ]

  return (
    <section className="py-20 lg:py-28 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Ace Your Placements?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Join thousands of students preparing smarter with data-driven dashboards.
              Your participation helps us build better learning experiences for everyone.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/30 text-primary-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" variant="primary" leftIcon={<Users className="h-5 w-5" />} rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="card bg-gray-800 border-gray-700 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-4">Experiment Status: Live</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Total Participants</p>
                        <p className="text-sm text-gray-400">1,247</p>
                      </div>
                    </div>
                    <BarChart3 className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Variation A</p>
                      <p className="text-2xl font-bold text-white mt-1">623</p>
                      <p className="text-xs text-green-400 mt-1">54% completion rate</p>
                    </div>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Variation B</p>
                      <p className="text-2xl font-bold text-white mt-1">624</p>
                      <p className="text-xs text-blue-400 mt-1">61% completion rate</p>
                    </div>
                  </div>
                  <div className="p-4 bg-primary-900/30 border border-primary-800 rounded-lg">
                    <p className="text-sm text-primary-300">
                      <strong className="text-primary-100">Current Leader:</strong> Variation B (Personalized Roadmap)
                      is showing 7% higher completion rate. Experiment continues until statistical significance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}