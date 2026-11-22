import { Link } from 'react-router-dom'
import { BookOpen, GitBranch, MessageSquare, Users, Mail } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const currentYear = CURRENT_YEAR

  const links = {
    product: [
      { label: 'Daily Practice', href: '#' },
      { label: 'Personalized Roadmap', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Status', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: GitBranch, href: 'https://github.com', label: 'GitHub' },
    { icon: MessageSquare, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Users, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@placementpilot.com', label: 'Email' },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white dark:text-white">PlacementPilot</span>
            </Link>
            <p className="text-gray-400 dark:text-gray-400 max-w-sm mb-6">
              A Flagsmith Experimentation Hackathon project demonstrating A/B testing
              for placement preparation dashboards.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white dark:text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white dark:text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white dark:text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-400">
              © {currentYear} PlacementPilot. Built for Flagsmith Experimentation Hackathon.
            </p>
            <div className="flex items-center gap-6">
              {links.legal.map((link) => (
                <Link key={link.label} to={link.href} className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}