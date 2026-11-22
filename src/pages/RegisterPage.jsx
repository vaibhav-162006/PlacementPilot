import { RegisterForm } from '@components/auth/RegisterForm.jsx'
import { AuthGuard } from '@components/auth/AuthGuard.jsx'

export function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <RegisterForm />
    </AuthGuard>
  )
}