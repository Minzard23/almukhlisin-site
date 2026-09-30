import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase'
import JadwalSholat from '../components/JadwalSholat'

const FASILITAS = [
  {
    judul: 'Mini Studio',
    isi: 'Studio rekaman gratis untuk konten dakwah dan kreatif. Buka 24 jam.',
    to: '/studio',
    aksi: 'Booking studio',
  },
  {
    judul: 'Cafe Selasar',
    isi: 'Tempat nongkrong dan nugas sambil menunggu waktu sholat.',
    to: '/tentang',
    aksi: 'Lihat info',
  },
  {
    judul: 'Kajian Online',
    isi: 'Arsip kajian dan kegiatan masjid di Khidmat Channel.',
    to: '/kajian',
    aksi: 'Tonton kajian',
  },
]

export default function Beranda() {
  const [programs, setPrograms] = useState([])

  useEffect(() => {
    supabase
      .from('programs')
      .select('judul, slug, kategori, jadwal, pemateri')
      .eq('buka_pendaftaran', true)
      .order('created_at', { ascending: true })
      .limit(3)
      .then(({ data }) => setPrograms(data ?? []))
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-20 pt-14 md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
              Home of JAMES · Jaga Masjid
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Masjid Untuk Semua
            </h1>
            <p className="mt-4 text-stone-300 md:text-lg">
              Tempat ibadah, belajar, berkarya, dan nongkrong yang bermanfaat
              di Jl. Jakarta, Bandung.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to="/program"
                className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 hover:bg-amber-300"
              >
                Lihat Program
              </Link>
              <Link
                to="/studio"
                className="rounded-full border border-stone-500 px-6 py-3 font-semibold hover:bg-stone-800"
              >
                Booking Studio
              </Link>
            </div>
          </div>
          <img
            src="/logo.jpg"
            alt="Logo Masjid Al-Mukhlisin"
            className="w-48 rounded-3xl shadow-2xl md:w-72"
          />
        </div>
      </section>

      {/* JADWAL SHOLAT — sengaja "naik" menimpa hero dengan -mt-10 */}
      <section className="mx-auto -mt-10 max-w-6xl px-4">
        <JadwalSholat />
      </section>

      {/* PROGRAM */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">Program yang Sedang Dibuka</h2>
          <Link to="/program" className="shrink-0 text-sm font-semibold text-amber-700 hover:underline">
            Semua program →
          </Link>
        </div>

        {programs.length === 0 && (
          <p className="mt-6 text-stone-500">Belum ada program yang dibuka.</p>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p.slug}
              to={`/program/${p.slug}`}
              className="rounded-2xl bg-white p-5 ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-800">
                {p.kategori}
              </span>
              <h3 className="mt-3 text-lg font-bold">{p.judul}</h3>
              <p className="mt-1 text-sm text-stone-500">{p.jadwal}</p>
              <p className="mt-3 text-sm text-stone-600">{p.pemateri}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FASILITAS */}
      <section className="bg-stone-100">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-14 md:grid-cols-3">
          {FASILITAS.map((f) => (
            <div key={f.judul} className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
              <h3 className="text-lg font-bold">{f.judul}</h3>
              <p className="mt-2 text-sm text-stone-600">{f.isi}</p>
              <Link to={f.to} className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:underline">
                {f.aksi} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}