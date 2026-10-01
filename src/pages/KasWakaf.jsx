import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah, formatBulan } from '../lib/format'

// Ganti dengan rekening resmi dari DKM
const REKENING = {
  bank: 'Bank Syariah Indonesia (dummy)',
  nomor: '7123 4567 89',
  atasNama: 'DKM Masjid Al-Mukhlisin',
}

export default function KasWakaf() {
  const [kas, setKas] = useState([])
  const [wakaf, setWakaf] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ambil dua tabel sekaligus, tunggu keduanya selesai
    Promise.all([
      supabase.from('kas_bulanan').select('*').order('bulan', { ascending: false }).limit(6),
      supabase.from('wakaf').select('*').eq('aktif', true).order('created_at'),
    ]).then(([hasilKas, hasilWakaf]) => {
      setKas(hasilKas.data ?? [])
      setWakaf(hasilWakaf.data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <p className="mx-auto max-w-5xl px-4 py-12 text-stone-400">Memuat data...</p>
  }

  const terbaru = kas[0] // bulan paling baru (karena diurutkan menurun)

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Kas & Wakaf</h1>
      <p className="mt-2 text-stone-500">
        Laporan keuangan masjid yang terbuka untuk jamaah, sebagai bentuk amanah dan transparansi.
      </p>

      {/* RINGKASAN KAS BULAN TERAKHIR */}
      {terbaru ? (
        <div className="mt-8 rounded-2xl bg-stone-900 p-6 text-white">
          <p className="text-sm text-stone-400">Laporan kas {formatBulan(terbaru.bulan)}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-stone-400">Pemasukan</p>
              <p className="text-xl font-bold text-emerald-400">{formatRupiah(terbaru.pemasukan)}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Pengeluaran</p>
              <p className="text-xl font-bold text-red-400">{formatRupiah(terbaru.pengeluaran)}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Saldo akhir</p>
              <p className="text-xl font-bold text-amber-300">{formatRupiah(terbaru.saldo_akhir)}</p>
            </div>
          </div>
          {terbaru.rincian && (
            <p className="mt-4 border-t border-stone-700 pt-4 text-sm text-stone-300">
              Pengeluaran utama: {terbaru.rincian}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-8 text-stone-500">Belum ada laporan kas.</p>
      )}

      {/* RIWAYAT KAS */}
      {kas.length > 1 && (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-stone-500">
              <tr>
                <th className="px-4 py-3">Bulan</th>
                <th className="px-4 py-3 text-right">Pemasukan</th>
                <th className="px-4 py-3 text-right">Pengeluaran</th>
                <th className="px-4 py-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {kas.map((k) => (
                <tr key={k.id} className="border-t border-stone-100">
                  <td className="px-4 py-3">{formatBulan(k.bulan)}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(k.pemasukan)}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(k.pengeluaran)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatRupiah(k.saldo_akhir)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PROGRAM WAKAF */}
      <h2 className="mt-14 text-2xl font-bold">Program Wakaf</h2>
      {wakaf.length === 0 && <p className="mt-4 text-stone-500">Belum ada program wakaf aktif.</p>}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {wakaf.map((w) => {
          // Persentase, dibatasi maksimal 100 supaya bar tidak "kebablasan"
          const persen = Math.min(100, Math.round((w.terkumpul / w.target) * 100))
          return (
            <div key={w.id} className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
              <h3 className="text-lg font-bold">{w.judul}</h3>
              <p className="mt-2 text-sm text-stone-600">{w.deskripsi}</p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-200">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${persen}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="font-semibold">{formatRupiah(w.terkumpul)}</span>
                <span className="text-stone-500">{persen}% dari {formatRupiah(w.target)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* REKENING */}
      <div className="mt-10 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <h2 className="text-lg font-bold">Salurkan Infaq & Wakaf</h2>
        <p className="mt-3 text-sm text-stone-600">{REKENING.bank}</p>
        <p className="text-2xl font-bold tracking-wider">{REKENING.nomor}</p>
        <p className="text-sm text-stone-600">a.n. {REKENING.atasNama}</p>
        <p className="mt-3 text-xs text-stone-500">
          Konfirmasi transfer melalui WhatsApp admin agar tercatat dalam laporan.
        </p>
      </div>
    </section>
  )
}