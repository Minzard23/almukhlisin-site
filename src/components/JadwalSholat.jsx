import { useEffect, useState } from "react";

const DAFTAR_WAKTU = [
    {key: 'Fajr', label: 'Subuh' },
    {key: 'Sunrise', label: 'Terbit' },
    {key: 'Dhuhr', label: 'Dzuhur' },
    {key: 'Asr', label: 'Ashar' },
    {key: 'Maghrib', label: 'Maghrib' },
    {key: 'Isha', label: 'Isya' },
]

//koordinat Masjid Al-Mukhlisin, Jln Jakarta, Bandung
const LAT = -6.9153
const LNG = 107.6367

function tanggalHariIni() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}` // format DD-MM-YYYY
}

export default function JadwalSholat() {
  const [jadwal, setJadwal] = useState(null)
  const [gagal, setGagal] = useState(false)

  useEffect(() => {
    // method=20 → metode perhitungan Kementerian Agama RI
    const url =
      `https://api.aladhan.com/v1/timings/${tanggalHariIni()}` +
      `?latitude=${LAT}&longitude=${LNG}&method=20&timezonestring=Asia/Jakarta`

    fetch(url)
      .then((res) => res.json())
      .then((json) => setJadwal(json.data.timings))
      .catch(() => setGagal(true))
  }, [])

  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-stone-200">
      <p className="text-sm font-semibold text-stone-500">
        Jadwal Sholat Hari Ini · Bandung
      </p>

      {gagal && (
        <p className="mt-3 text-sm text-red-600">Jadwal sholat gagal dimuat.</p>
      )}

      {!jadwal && !gagal && (
        <p className="mt-3 text-sm text-stone-400">Memuat jadwal...</p>
      )}

      {jadwal && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {DAFTAR_WAKTU.map((w) => (
            <li key={w.key} className="rounded-xl bg-stone-100 p-3 text-center">
              <p className="text-xs text-stone-500">{w.label}</p>
              <p className="text-lg font-bold text-stone-800">{jadwal[w.key]}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}