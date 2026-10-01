import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { supabase } from '../lib/supabase'
import FormPendaftaran from '../components/FormPendaftaran'

// "2026-10-05" → "5 Oktober 2026"
function formatTanggal(tgl) {
  if (!tgl) return null
  return new Date(tgl).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ProgramDetail() {
  const { slug } = useParams() // /program/sirah-nabawiyah → slug = "sirah-nabawiyah"
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle() // ambil 1 baris saja (atau null kalau tidak ada)
      .then(({ data }) => {
        setProgram(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-12 text-stone-400">Memuat...</p>
  }

  if (!program) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold">Program tidak ditemukan</h1>
        <Link to="/program" className="mt-4 inline-block text-amber-700 hover:underline">
          ← Kembali ke daftar program
        </Link>
      </section>
    )
  }

  const info = [
    { label: 'Pemateri', isi: program.pemateri },
    { label: 'Jadwal', isi: program.jadwal },
    { label: 'Mulai', isi: formatTanggal(program.tanggal_mulai) },
    { label: 'Jumlah sesi', isi: program.jumlah_sesi && `${program.jumlah_sesi} pertemuan` },
    { label: 'Kuota', isi: program.kuota && `${program.kuota} peserta` },
  ].filter((i) => i.isi) // sembunyikan info yang kosong

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/program" className="text-sm text-amber-700 hover:underline">
        ← Semua program
      </Link>

      <span className="mt-6 block w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-800">
        {program.kategori}
      </span>
      <h1 className="mt-3 text-3xl font-bold">{program.judul}</h1>
      <p className="mt-4 leading-relaxed text-stone-600">{program.deskripsi}</p>

      <dl className="mt-6 grid gap-3 rounded-2xl bg-white p-5 ring-1 ring-stone-200 sm:grid-cols-2">
        {info.map((i) => (
          <div key={i.label}>
            <dt className="text-xs text-stone-500">{i.label}</dt>
            <dd className="font-semibold">{i.isi}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        {program.buka_pendaftaran ? (
          <FormPendaftaran program={program} />
        ) : (
          <p className="rounded-2xl bg-stone-100 p-5 text-stone-600">
            Pendaftaran program ini sudah ditutup.
          </p>
        )}
      </div>
    </section>
  )
}
