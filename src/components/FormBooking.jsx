import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const FORM_KOSONG = {
  nama: '',
  whatsapp: '',
  email: '',
  keperluan: '',
  tanggal: '',
  jam_mulai: '',
  jam_selesai: '',
  setuju_aturan: false,
}

// "2026-10-05" + "19:30" → "2026-10-05T19:30:00+07:00" (waktu WIB)
const keWaktuWIB = (tanggal, jam) => `${tanggal}T${jam}:00+07:00`

const formatJam = (waktu) =>
  new Date(waktu).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })

function hariIni() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}` // format YYYY-MM-DD untuk input date
}

export default function FormBooking() {
  const [form, setForm] = useState(FORM_KOSONG)
  const [slots, setSlots] = useState([]) // jam yang sudah terisi di tanggal terpilih
  const [status, setStatus] = useState('isi') // isi | mengirim | berhasil
  const [error, setError] = useState('')

  // Setiap kali tanggal berubah → ambil jam yang sudah terisi
  useEffect(() => {
    if (!form.tanggal) return
    supabase
      .rpc('slot_studio', { tgl: form.tanggal })
      .then(({ data }) => setSlots(data ?? []))
  }, [form.tanggal])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    setError('') // hapus pesan error lama begitu pengguna mengubah isian
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const mulai = keWaktuWIB(form.tanggal, form.jam_mulai)
    const selesai = keWaktuWIB(form.tanggal, form.jam_selesai)

    if (new Date(selesai) <= new Date(mulai)) {
      setError('Jam selesai harus setelah jam mulai.')
      return
    }

    // Dua rentang waktu bentrok jika: mulaiA < selesaiB DAN selesaiA > mulaiB
    const bentrok = slots.some(
      (s) => new Date(mulai) < new Date(s.selesai) && new Date(selesai) > new Date(s.mulai)
    )
    if (bentrok) {
      setError('Jam tersebut sudah dipesan. Silakan pilih jam lain.')
      return
    }

    setStatus('mengirim')
    const { error } = await supabase.from('studio_bookings').insert({
      nama: form.nama.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim() || null,
      keperluan: form.keperluan.trim(),
      mulai,
      selesai,
      setuju_aturan: form.setuju_aturan,
      // status TIDAK dikirim → otomatis 'menunggu' (default di database)
    })

    if (error) {
      setError('Booking gagal dikirim. Coba lagi beberapa saat.')
      setStatus('isi')
      return
    }
    setStatus('berhasil')
  }

  if (status === 'berhasil') {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200">
        <h2 className="text-xl font-bold text-emerald-800">Booking terkirim! 🎬</h2>
        <p className="mt-2 text-emerald-700">
          Permintaanmu sedang <b>menunggu persetujuan admin</b>. Konfirmasi akan dikirim
          melalui WhatsApp ke {form.whatsapp}.
        </p>
      </div>
    )
  }

  const input = 'mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none'
  const label = 'block text-sm font-semibold text-stone-700'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-stone-200">
      <h2 className="text-xl font-bold">Formulir Booking Studio</h2>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className={label}>
          Tanggal *
          <input type="date" name="tanggal" min={hariIni()} value={form.tanggal} onChange={handleChange} required className={input} />
        </label>
        <label className={label}>
          Jam mulai *
          <input type="time" name="jam_mulai" value={form.jam_mulai} onChange={handleChange} required className={input} />
        </label>
        <label className={label}>
          Jam selesai *
          <input type="time" name="jam_selesai" value={form.jam_selesai} onChange={handleChange} required className={input} />
        </label>
      </div>

      {form.tanggal && (
        <div className="rounded-xl bg-stone-100 p-4 text-sm">
          <p className="font-semibold">Jadwal yang sudah terisi di tanggal ini:</p>
          {slots.length === 0 ? (
            <p className="mt-1 text-emerald-700">Masih kosong, semua jam tersedia ✅</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {slots.map((s) => (
                <li key={s.mulai} className="flex justify-between">
                  <span>
                    {formatJam(s.mulai)} – {formatJam(s.selesai)}
                  </span>
                  <span className={s.status === 'disetujui' ? 'text-red-600' : 'text-amber-700'}>
                    {s.status === 'disetujui' ? 'Terpakai' : 'Menunggu konfirmasi'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Nama *
          <input name="nama" value={form.nama} onChange={handleChange} required className={input} />
        </label>
        <label className={label}>
          No. WhatsApp *
          <input
            type="tel"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            required
            pattern="[0-9+]{9,15}"
            title="Hanya angka, 9–15 digit. Contoh: 081234567890"
            placeholder="081234567890"
            className={input}
          />
        </label>
        <label className={label}>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} className={input} />
        </label>
        <label className={label}>
          Keperluan *
          <input name="keperluan" value={form.keperluan} onChange={handleChange} required placeholder="Contoh: rekam podcast kajian" className={input} />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="setuju_aturan" checked={form.setuju_aturan} onChange={handleChange} required className="mt-1" />
        <span>Saya sudah membaca dan setuju dengan aturan pemakaian studio. *</span>
      </label>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === 'mengirim'}
        className="w-full rounded-full bg-amber-400 py-3 font-semibold text-stone-900 hover:bg-amber-300 disabled:opacity-50"
      >
        {status === 'mengirim' ? 'Mengirim...' : 'Ajukan Booking'}
      </button>
    </form>
  )
}