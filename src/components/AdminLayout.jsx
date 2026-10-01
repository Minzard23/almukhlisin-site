import { Navigate, NavLink, Outlet } from 'react-router'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/useSession'

const MENU = [
  { to: '/admin', label: '🏠 Ringkasan' },
  { to: '/admin/pendaftar', label: '📝 Pendaftar Kelas' },
  { to: '/admin/booking', label: '🎬 Booking Studio' },
  { to: '/admin/program', label: '📚 Program' },
  { to: '/admin/kas', label: '💰 Kas & Wakaf' },
]

export default function AdminLayout() {
  const session = useSession()

  // Masih mengecek sesi → tampilkan loading dulu (jangan langsung tendang ke login)
  if (session === undefined) {
    return <p className="p-8 text-stone-400">Memeriksa sesi...</p>
  }

  // Belum login → arahkan ke halaman login
  if (session === null) {
    return <Navigate to="/admin/login" replace />
  }

  const linkClass = ({ isActive }) =>
    `block whitespace-nowrap rounded-xl px-4 py-3 font-semibold ${
      isActive ? 'bg-amber-400 text-stone-900' : 'text-stone-300 hover:bg-stone-800'
    }`

  return (
    <div className="min-h-screen bg-stone-100 md:flex">
      <aside className="bg-stone-900 p-4 md:min-h-screen md:w-64">
        <p className="px-2 font-bold text-white">Admin Al-Mukhlisin</p>
        <p className="truncate px-2 text-xs text-stone-400">{session.user.email}</p>

        {/* Di HP menu bisa digeser ke samping, di laptop menjadi kolom */}
        <nav className="mt-4 flex gap-2 overflow-x-auto md:flex-col">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/admin'} className={linkClass}>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 flex gap-2 md:mt-8 md:flex-col">
          <a href="/" target="_blank" className="rounded-xl px-4 py-2 text-sm text-stone-400 hover:text-white">
            Lihat website ↗
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-xl px-4 py-2 text-left text-sm text-red-400 hover:text-red-300"
          >
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}