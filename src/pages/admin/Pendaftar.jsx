import { useEffect, useState } from 'react'
import writeExcelFile from 'write-excel-file/browser'
import { supabase } from '../../lib/supabase'

// "08123..." → "628123..." supaya bisa dibuka di wa.me
const keLinkWA = (nomor) => `https://wa.me/${nomor.replace(/^0/, '62').replace(/\D/g, '')}`

const formatTanggal = (t) =>
  new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

// Kolom-kolom yang ditulis ke file Excel
const KOLOM_EXCEL = [
  { header: 'Nama Lengkap', width: 28, cell: (r) => ({ value: r.nama_lengkap }) },
  { header: 'Panggilan', width: 14, cell: (r) => ({ value: r.nama_panggilan ?? '' }) },
  { header: 'Jenis Kelamin', width: 14, cell: (r) => ({ value: r.jenis_kelamin }) },
  { header: 'WhatsApp', width: 16, cell: (r) => ({ value: r.whatsapp }) },
  { header: 'Email', width: 28, cell: (r) => ({ value: r.email }) },
  { header: 'Domisili', width: 20, cell: (r) => ({ value: r.domisili ?? '' }) },
  { header: 'Tanggal Lahir', width: 14, cell: (r) => ({ value: r.tanggal_lahir ?? '' }) },
  { header: 'Sumber Info', width: 16, cell: (r) => ({ value: r.sumber_info ?? '' }) },
  { header: 'Topik Diharapkan', width: 30, cell: (r) => ({ value: r.harapan ?? '' }) },
  { header: 'Pertanyaan', width: 30, cell: (r) => ({ value: r.pertanyaan ?? '' }) },
  { header: 'Waktu Daftar', width: 16, cell: (r) => ({ value: formatTanggal(r.created_at) }) },
]

export default function Pendaftar() {
  const [programs, setPrograms] = useState([])
  const [programId, setProgramId] = useState('')
  const [pendaftar, setPendaftar] = useState([])
  const [loading, setLoading] = useState(false)

  // 1. Ambil daftar program untuk pilihan dropdown
  useEffect(() => {
    supabase
      .from('programs')
      .select('id, judul')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPrograms(data ?? [])
        if (data?.length) setProgramId(data[0].id) // otomatis pilih program pertama
      })
  }, [])

  // 2. Setiap kali program dipilih → ambil pendaftarnya
  useEffect(() => {
    if (!programId) return
    setLoading(true)
    supabase
      .from('registrations')
      .select('*')
      .eq('program_id', programId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setPendaftar(data ?? [])
        setLoading(false)
      })
  }, [programId])

  const programTerpilih = programs.find((p) => p.id === programId)
  const jumlahIkhwan = pendaftar.filter((p) => p.jenis_kelamin === 'ikhwan').length
  const jumlahAkhwat = pendaftar.length - jumlahIkhwan

  async function downloadExcel() {
    const namaFile = `Pendaftar - ${programTerpilih?.judul ?? 'program'}.xlsx`
    await writeExcelFile(pendaftar, { columns: KOLOM_EXCEL }).toFile(namaFile)
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Pendaftar Kelas</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold">
          Pilih program
          <select
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-3"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.judul}</option>
            ))}
          </select>
        </label>
        <button
          onClick={downloadExcel}
          disabled={pendaftar.length === 0}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          ⬇ Download Excel
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
          <p className="text-2xl font-bold">{pendaftar.length}</p>
          <p className="text-xs text-stone-500">Total</p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
          <p className="text-2xl font-bold">{jumlahIkhwan}</p>
          <p className="text-xs text-stone-500">Ikhwan</p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
          <p className="text-2xl font-bold">{jumlahAkhwat}</p>
          <p className="text-xs text-stone-500">Akhwat</p>
        </div>
      </div>

      {loading && <p className="mt-6 text-stone-400">Memuat pendaftar...</p>}
      {!loading && pendaftar.length === 0 && (
        <p className="mt-6 text-stone-500">Belum ada pendaftar untuk program ini.</p>
      )}

      {!loading && pendaftar.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">L/P</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Domisili</th>
                <th className="px-4 py-3">Daftar</th>
              </tr>
            </thead>
            <tbody>
              {pendaftar.map((p, i) => (
                <tr key={p.id} className="border-t border-stone-100">
                  <td className="px-4 py-3 text-stone-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{p.nama_lengkap}</p>
                    <p className="text-xs text-stone-500">{p.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.jenis_kelamin}</td>
                  <td className="px-4 py-3">
                    <a href={keLinkWA(p.whatsapp)} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                      {p.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3">{p.domisili ?? '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatTanggal(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}