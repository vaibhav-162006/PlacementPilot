import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Lock, User, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react'
import { Button } from '@components/common/Button.jsx'
import { Input, Select } from '@components/common/Input.jsx'
import { useAuth } from '@contexts/AuthContext.jsx'

const graduationYears = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i
  return { value: year.toString(), label: year.toString() }
})

const targetRoles = [
  { value: '', label: 'Select target role' },
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'frontend_developer', label: 'Frontend Developer' },
  { value: 'backend_developer', label: 'Backend Developer' },
  { value: 'fullstack_developer', label: 'Full Stack Developer' },
  { value: 'devops_engineer', label: 'DevOps Engineer' },
  { value: 'other', label: 'Other' },
]

export function RegisterForm() {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    graduationYear: '',
    targetRole: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format'
    if (formData.password.length < 8) return 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    if (!formData.college.trim()) return 'College name is required'
    if (!formData.graduationYear) return 'Graduation year is required'
    if (!formData.targetRole) return 'Target role is required'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    const { success, error: regError } = await register(formData.email, formData.password, {
      full_name: formData.fullName,
      college: formData.college,
      graduation_year: parseInt(formData.graduationYear),
      target_role: formData.targetRole,
    })

    if (success) {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        college: '',
        graduationYear: '',
        targetRole: '',
      })
    } else {
      setError(regError?.message || 'Registration failed. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Start your personalized placement preparation journey</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-error-50 border border-error-200 text-error-600 text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                leftIcon={<User className="h-5 w-5" />}
                required
                disabled={submitting}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                leftIcon={<Mail className="h-5 w-5" />}
                required
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="College"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Your College"
                leftIcon={<GraduationCap className="h-5 w-5" />}
                required
                disabled={submitting}
              />
              <Select
                label="Graduation Year"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                options={graduationYears}
                required
                disabled={submitting}
              />
            </div>

            <Select
              label="Target Role"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              options={targetRoles}
              required
              disabled={submitting}
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                required
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              leftIcon={<Lock className="h-5 w-5" />}
              required
              autoComplete="new-password"
              disabled={submitting}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={submitting || loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}