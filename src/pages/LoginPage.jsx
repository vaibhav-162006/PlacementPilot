import { LoginForm } from '@components/auth/LoginForm.jsx'
import { AuthGuard } from '@components/auth/AuthGuard.jsx'

export function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  )
}