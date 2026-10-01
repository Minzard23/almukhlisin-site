import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [angka, setAngka] = useState(null)

  useEffect(() => {
    // head: true → hanya hitung jumlah baris, tanpa mengambil isinya (lebih ringan)
    const hitung = (query) => query.then(({ count }) => count ?? 0)

    Promise.all([
      hitung(supabase.from('registrations').select('*', { count: 'exact', head: true })),
      hitung(
        supabase.from('studio_bookings').select('*', { count: 'exact', head: true }).eq('status', 'menunggu')
      ),
      hitung(
        supabase.from('programs').select('*', { count: 'exact', head: true }).eq('buka_pendaftaran', true)
      ),
    ]).then(([pendaftar, bookingMenunggu, programBuka]) =>
      setAngka({ pendaftar, bookingMenunggu, programBuka })
    )
  }, [])

  const kartu = angka && [
    { label: 'Total pendaftar kelas', nilai: angka.pendaftar, to: '/admin/pendaftar' },
    { label: 'Booking menunggu persetujuan', nilai: angka.bookingMenunggu, to: '/admin/booking', penting: angka.bookingMenunggu > 0 },
    { label: 'Program yang dibuka', nilai: angka.programBuka, to: '/admin/program' },
  ]

  return (
    <>
      <h1 className="text-2xl font-bold">Assalamu'alaikum 👋</h1>
      <p className="mt-1 text-stone-500">Ringkasan website masjid hari ini.</p>

      {!angka && <p className="mt-6 text-stone-400">Memuat...</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {kartu?.map((k) => (
          <Link
            key={k.label}
            to={k.to}
            className={`rounded-2xl p-6 ring-1 transition hover:-translate-y-1 ${
              k.penting ? 'bg-amber-100 ring-amber-300' : 'bg-white ring-stone-200'
            }`}
          >
            <p className="text-4xl font-bold">{k.nilai}</p>
            <p className="mt-2 text-sm text-stone-600">{k.label}</p>
          </Link>
        ))}
      </div>
    </>
  )
}