import { useState } from 'react'
import { Link, NavLink } from 'react-router'

const menu = [
  { to: '/', label: 'Beranda' },
  { to: '/program', label: 'Program' },
  { to: '/kajian', label: 'Kajian' },
  { to: '/studio', label: 'Studio' },
  { to: '/kas-wakaf', label: 'Kas & Wakaf' },
  { to: '/tentang', label: 'Tentang' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    isActive
      ? 'font-semibold text-amber-300'
      : 'text-stone-300 hover:text-white'

  return (
    <header className="sticky top-0 z-50 bg-stone-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo Masjid Al-Mukhlisin" className="h-10 w-10 rounded-md object-cover" />
          <span className="font-bold text-white">Masjid Al-Mukhlisin</span>
        </Link>

        {/* Menu untuk layar besar */}
        <ul className="hidden gap-6 md:flex">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end className={linkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Tombol menu untuk HP */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md px-3 py-2 text-white md:hidden"
          aria-label="Buka menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Menu dropdown untuk HP */}
      {open && (
        <ul className="space-y-1 border-t border-stone-700 px-4 py-3 md:hidden">
          {menu.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="block py-2">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}