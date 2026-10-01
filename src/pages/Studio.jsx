import FormBooking from '../components/FormBooking'

const FASILITAS = ['Kamera (dummy)', 'Mic podcast (dummy)', 'Lampu studio (dummy)', 'Backdrop / green screen (dummy)']

const ATURAN = [
  'Studio gratis dan buka 24 jam, dengan persetujuan admin.',
  'Dilarang membuang sampah di dalam studio.',
  'Peminjam bertanggung jawab atas semua peralatan yang digunakan.',
  'Kembalikan peralatan dan ruangan seperti semula setelah dipakai.',
  'Konten yang dibuat tidak bertentangan dengan nilai-nilai Islam.',
  'Datang tepat waktu. Jika berhalangan, kabari admin melalui WhatsApp.',
]

export default function Studio() {
  return (
    <>
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            Gratis · Buka 24 Jam
          </p>
          <h1 className="mt-3 text-4xl font-bold">Mini Studio Al-Mukhlisin</h1>
          <p className="mt-4 text-stone-300">
            Butuh tempat untuk rekam podcast, video dakwah, atau konten kreatif? Pakai
            mini studio masjid, gratis. Cukup ajukan booking, lalu tunggu konfirmasi admin.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-12 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
          <h2 className="text-lg font-bold">Fasilitas</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            {FASILITAS.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
          <h2 className="text-lg font-bold">Aturan Pemakaian</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-stone-600">
            {ATURAN.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14">
        <FormBooking />
      </section>
    </>
  )
}