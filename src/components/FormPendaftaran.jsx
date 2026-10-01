import { useState } from 'react'
import { supabase } from '../lib/supabase'

const FORM_KOSONG = {
  nama_lengkap: '',
  nama_panggilan: '',
  email: '',
  jenis_kelamin: '',
  tanggal_lahir: '',
  domisili: '',
  whatsapp: '',
  pernah_belajar: '',
  sumber_info: '',
  harapan: '',
  pertanyaan: '',
  komitmen_hadir: false,
}

const SUMBER_INFO = ['Instagram', 'WhatsApp Story', 'Grup WhatsApp', 'Teman', 'Saudara/Kerabat', 'Poster']

// Input yang dikosongkan dikirim sebagai null, bukan "" (kolom tanggal tidak menerima "")
const kosongJadiNull = (v) => (v === '' ? null : v)

export default function FormPendaftaran({ program }) {
  const [form, setForm] = useState(FORM_KOSONG)
  const [status, setStatus] = useState('isi') // isi | mengirim | berhasil
  const [error, setError] = useState('')

  // Satu fungsi untuk SEMUA input: pakai atribut name sebagai kunci
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault() // cegah halaman reload
    setStatus('mengirim')
    setError('')

    const { error } = await supabase.from('registrations').insert({
      program_id: program.id,
      nama_lengkap: form.nama_lengkap.trim(),
      nama_panggilan: kosongJadiNull(form.nama_panggilan.trim()),
      email: form.email.trim().toLowerCase(),
      jenis_kelamin: form.jenis_kelamin,
      tanggal_lahir: kosongJadiNull(form.tanggal_lahir),
      domisili: kosongJadiNull(form.domisili.trim()),
      whatsapp: form.whatsapp.trim(),
      pernah_belajar: form.pernah_belajar === '' ? null : form.pernah_belajar === 'ya',
      sumber_info: kosongJadiNull(form.sumber_info),
      harapan: kosongJadiNull(form.harapan.trim()),
      pertanyaan: kosongJadiNull(form.pertanyaan.trim()),
      komitmen_hadir: form.komitmen_hadir,
    })

    if (error) {
      // 23505 = melanggar aturan unique (email sudah terdaftar di program ini)
      setError(
        error.code === '23505'
          ? 'Email ini sudah terdaftar di program ini.'
          : 'Pendaftaran gagal dikirim. Coba lagi beberapa saat.'
      )
      setStatus('isi')
      return
    }

    setStatus('berhasil')
  }

  if (status === 'berhasil') {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200">
        <h2 className="text-xl font-bold text-emerald-800">Pendaftaran berhasil! 🎉</h2>
        <p className="mt-2 text-emerald-700">
          Jazakallahu khairan, {form.nama_panggilan || form.nama_lengkap}. Informasi
          selanjutnya akan dikirim oleh admin melalui WhatsApp.
        </p>
      </div>
    )
  }

  const input = 'mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none'
  const label = 'block text-sm font-semibold text-stone-700'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-stone-200">
      <h2 className="text-xl font-bold">Formulir Pendaftaran</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Nama lengkap * <span className="font-normal text-stone-400">(untuk sertifikat)</span>
          <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required className={input} />
        </label>
        <label className={label}>
          Nama panggilan
          <input name="nama_panggilan" value={form.nama_panggilan} onChange={handleChange} className={input} />
        </label>
        <label className={label}>
          Email *
          <input type="email" name="email" value={form.email} onChange={handleChange} required className={input} />
        </label>
        <label className={label}>
          No. WhatsApp aktif *
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
          Tanggal lahir
          <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className={input} />
        </label>
        <label className={label}>
          Domisili
          <input name="domisili" value={form.domisili} onChange={handleChange} placeholder="Contoh: Antapani, Bandung" className={input} />
        </label>
      </div>

      <fieldset>
        <legend className={label}>Jenis kelamin *</legend>
        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="jenis_kelamin" value="ikhwan" checked={form.jenis_kelamin === 'ikhwan'} onChange={handleChange} required />
            Ikhwan
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="jenis_kelamin" value="akhwat" checked={form.jenis_kelamin === 'akhwat'} onChange={handleChange} />
            Akhwat
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className={label}>Pernah mempelajari materi ini sebelumnya?</legend>
        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="pernah_belajar" value="ya" checked={form.pernah_belajar === 'ya'} onChange={handleChange} />
            Ya, pernah
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="pernah_belajar" value="belum" checked={form.pernah_belajar === 'belum'} onChange={handleChange} />
            Belum pernah
          </label>
        </div>
      </fieldset>

      <label className={label}>
        Tahu program ini dari mana?
        <select name="sumber_info" value={form.sumber_info} onChange={handleChange} className={input}>
          <option value="">Pilih salah satu</option>
          {SUMBER_INFO.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className={label}>
        Topik yang ingin dipelajari
        <textarea name="harapan" value={form.harapan} onChange={handleChange} rows={2} className={input} />
      </label>

      <label className={label}>
        Pertanyaan untuk pemateri
        <textarea name="pertanyaan" value={form.pertanyaan} onChange={handleChange} rows={2} className={input} />
      </label>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="komitmen_hadir" checked={form.komitmen_hadir} onChange={handleChange} required className="mt-1" />
        <span>
          Saya berkomitmen hadir
          {program.jumlah_sesi ? ` di seluruh ${program.jumlah_sesi} pertemuan` : ''} dan
          mengikuti aturan kelas. *
        </span>
      </label>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === 'mengirim'}
        className="w-full rounded-full bg-amber-400 py-3 font-semibold text-stone-900 hover:bg-amber-300 disabled:opacity-50"
      >
        {status === 'mengirim' ? 'Mengirim...' : 'Daftar Sekarang'}
      </button>
    </form>
  )
}
