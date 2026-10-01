import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import { useSession } from '../../lib/useSession'

export default function Login() {
  const session = useSession()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sudah login? Langsung ke dashboard
  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError('Email atau password salah.')
      return
    }
    navigate('/admin')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8">
        <div className="text-center">
          <img src="/logo.jpg" alt="" className="mx-auto h-16 w-16 rounded-xl" />
          <h1 className="mt-3 text-xl font-bold">Admin Al-Mukhlisin</h1>
          <p className="text-sm text-stone-500">Masuk untuk mengelola website</p>
        </div>

        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-3"
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-3"
          />
        </label>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber-400 py-3 text-lg font-semibold hover:bg-amber-300 disabled:opacity-50"
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
    </main>
  )
}