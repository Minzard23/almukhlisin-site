import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProgramCard from '../components/ProgramCard'

const FILTER = [
  { value: 'semua', label: 'Semua' },
  { value: 'kelas', label: 'Kelas' },
  { value: 'kajian', label: 'Kajian' },
  { value: 'talkshow', label: 'Talkshow' },
]

export default function Program() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('semua')

  useEffect(() => {
    supabase
      .from('programs')
      .select('judul, slug, kategori, jadwal, pemateri')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPrograms(data ?? [])
        setLoading(false)
      })
  }, [])

  // Tidak perlu state baru: daftar yang tampil DIHITUNG dari programs + filter
  const tampil =
    filter === 'semua' ? programs : programs.filter((p) => p.kategori === filter)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Program & Kelas</h1>
      <p className="mt-2 text-stone-500">
        Kelas, kajian, dan kegiatan di Masjid Al-Mukhlisin. Semua terbuka untuk umum.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTER.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? 'rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white'
                : 'rounded-full bg-white px-4 py-2 text-sm text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-stone-400">Memuat program...</p>}

      {!loading && tampil.length === 0 && (
        <p className="mt-8 text-stone-500">Belum ada program di kategori ini.</p>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {tampil.map((p) => (
          <ProgramCard key={p.slug} program={p} />
        ))}
      </div>
    </section>
  )
}
