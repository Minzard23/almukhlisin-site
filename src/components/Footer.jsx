export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-bold text-white">Masjid Al-Mukhlisin</p>
          <p className="mt-2 text-sm">Jl. Jakarta No. 20, Bandung</p>
          <p className="mt-1 text-sm">Masjid Untuk Semua</p>
        </div>
        <div>
          <p className="font-semibold text-white">Kontak</p>
          <p className="mt-2 text-sm">WA: 0812-0000-0000 (dummy)</p>
          <p className="mt-1 text-sm">Email: info@masjidalmukhlisin.id (dummy)</p>
        </div>
        <div>
          <p className="font-semibold text-white">Ikuti Kami</p>
          <a href="https://www.instagram.com/almukhlisin.id/" target="_blank" rel="noreferrer" className="mt-2 block text-sm hover:text-white">
            Instagram @almukhlisin.id
          </a>
          <a href="https://www.youtube.com/channel/UClCOKlfrICIQVQRTpOQ9byg" target="_blank" rel="noreferrer" className="mt-1 block text-sm hover:text-white">
            YouTube Khidmat Channel
          </a>
        </div>
      </div>
      <p className="border-t border-stone-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} Masjid Al-Mukhlisin Bandung
      </p>
    </footer>
  )
}