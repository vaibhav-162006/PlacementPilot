import { useState } from 'react'
import { AuthGuard } from '@components/auth/AuthGuard.jsx'
import { Layout, PageHeader } from '@components/common/Layout.jsx'
import { Card, CardHeader, CardBody, CardTitle } from '@components/common/Card.jsx'
import { Button } from '@components/common/Button.jsx'
import { Input } from '@components/common/Input.jsx'
import { useAuth } from '@contexts/AuthContext.jsx'
import { useExperiment } from '@hooks/useFlagsmith.js'
import { LoadingSpinner } from '@components/common/LoadingSpinner.jsx'
import { formatDate, getVariationLabel } from '@utils/helpers.js'
import { User, Mail, GraduationCap, Briefcase, Calendar, BarChart3, Settings } from 'lucide-react'

function ProfileContent() {
  const { profile, user, updateProfile, experimentVariation } = useAuth()
  const { variation } = useExperiment()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    graduationYear: '',
    targetRole: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const graduationYears = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i
    return year.toString()
  })

  const targetRoles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Other',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    const { success, error } = await updateProfile(formData)

    if (success) {
      setMessage('Profile updated successfully!')
      setEditing(false)
    } else {
      setMessage(error?.message || 'Failed to update profile')
    }
    setSaving(false)
  }

  const handleCancel = () => {
    setFormData({
      fullName: profile?.full_name || '',
      college: profile?.college || '',
      graduationYear: profile?.graduation_year?.toString() || '',
      targetRole: profile?.target_role || '',
    })
    setEditing(false)
    setMessage('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your account information and view your experiment assignment"
      />

      {/* Account Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Account Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName || profile?.full_name || ''}
              onChange={handleChange}
              disabled={!editing}
              leftIcon={<User className="h-5 w-5" />}
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="h-5 w-5" />}
            />
            <Input
              label="College"
              name="college"
              value={formData.college || profile?.college || ''}
              onChange={handleChange}
              disabled={!editing}
              leftIcon={<GraduationCap className="h-5 w-5" />}
            />
            <Input
              label="Graduation Year"
              name="graduationYear"
              type="number"
              value={formData.graduationYear || profile?.graduation_year?.toString() || ''}
              onChange={handleChange}
              disabled={!editing}
              leftIcon={<Calendar className="h-5 w-5" />}
            />
            <div className="md:col-span-2">
              <select
                name="targetRole"
                value={formData.targetRole || profile?.target_role || ''}
                onChange={handleChange}
                disabled={!editing}
                className="input"
              >
                <option value="">Select target role</option>
                {targetRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={saving}>
                Save Changes
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Experiment Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Experiment Assignment</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-primary-50">
              <div className="text-3xl font-bold text-primary-600">
                {getVariationLabel(variation)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Current Variation</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-900">
                {experimentVariation === variation ? 'Consistent' : 'Mismatch'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Assignment Status</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-900">
                {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Account Created</div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2">About This Experiment</h4>
            <p className="text-sm text-gray-600">
              You are participating in a Flagsmith A/B experiment comparing two dashboard experiences:
            </p>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>• <strong>Variation A (Daily Practice):</strong> Daily coding challenges, aptitude questions, and daily goals</li>
              <li>• <strong>Variation B (Personalized Roadmap):</strong> Weekly learning path with milestones and progress tracking</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Your assignment is controlled by Flagsmith feature flags and remains consistent across sessions.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gray-900">{variation === 'daily_practice' ? '7' : '4'}</div>
              <div className="text-sm text-gray-500">Weeks in Roadmap</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gray-900">23</div>
              <div className="text-sm text-gray-500">Problems Solved</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export function ProfilePage() {
  return (
    <AuthGuard>
      <Layout>
        <ProfileContent />
      </Layout>
    </AuthGuard>
  )
}