import { Hero } from '@components/landing/Hero.jsx'
import { Features } from '@components/landing/Features.jsx'
import { CTA } from '@components/landing/CTA.jsx'
import { Footer } from '@components/landing/Footer.jsx'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}