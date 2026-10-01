// Koordinat dari Google Maps Masjid Al-Mukhlisin
const MAPS_EMBED = 'https://www.google.com/maps?q=-6.9153392,107.6366766&z=17&output=embed'
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=-6.9153392,107.6366766'

const NILAI = [
  { judul: 'Masjid Untuk Semua', isi: 'Terbuka bagi siapa saja: jamaah sekitar, mahasiswa, pekerja, dan pendatang.' },
  { judul: 'Home of JAMES', isi: 'Rumah bagi para Jaga Masjid, anak muda yang memakmurkan masjid. (dummy)' },
  { judul: 'Masjid Haneuteun', isi: 'Suasana hangat dan nyaman untuk ibadah, belajar, dan berkarya. (dummy)' },
]

export default function Tentang() {
  return (
    <>
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-4xl font-bold">Tentang Masjid Al-Mukhlisin</h1>
          <p className="mt-4 leading-relaxed text-stone-300">
            Masjid Al-Mukhlisin berdiri di Jl. Jakarta No. 20, Bandung. Selain sebagai tempat
            ibadah, masjid ini menjadi ruang belajar dan berkarya bagi jamaah, terutama anak
            muda. (Profil dummy, akan diganti dengan profil resmi dari DKM.)
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold">Sejarah Singkat</h2>
        <p className="mt-3 leading-relaxed text-stone-600">
          Lorem ipsum: sejarah berdirinya masjid, tokoh pendiri, dan perkembangan kegiatan
          dari tahun ke tahun. (Dummy, menunggu data dari DKM.)
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {NILAI.map((n) => (
            <div key={n.judul} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200">
              <h3 className="font-bold">{n.judul}</h3>
              <p className="mt-2 text-sm text-stone-600">{n.isi}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
          <h2 className="text-xl font-bold">☕ Cafe Selasar</h2>
          <p className="mt-2 text-stone-600">
            Nongkrong dan nugas sambil menunggu waktu sholat. Ada Wi-Fi, colokan, dan
            minuman hangat. (Detail menu dan jam buka: dummy.)
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Lokasi</h2>
        <p className="mt-2 text-stone-600">Jl. Jakarta No. 20, Bandung</p>
        <div className="mt-4 aspect-video overflow-hidden rounded-2xl ring-1 ring-stone-200">
          <iframe
            className="h-full w-full"
            src={MAPS_EMBED}
            title="Peta lokasi Masjid Al-Mukhlisin"
            loading="lazy"
          />
        </div>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-700"
        >
          Buka di Google Maps
        </a>
      </section>
    </>
  )
}