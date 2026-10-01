import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProgramCard from '../components/ProgramCard'

// ID channel YouTube "Khidmat Channel"
const CHANNEL_ID = 'UClCOKlfrICIQVQRTpOQ9byg'
// Playlist "semua upload" sebuah channel = ID channel dengan awalan UC diganti UU
const PLAYLIST_UPLOAD = 'UU' + CHANNEL_ID.slice(2)

export default function Kajian() {
  const [kajian, setKajian] = useState([])

  useEffect(() => {
    supabase
      .from('programs')
      .select('judul, slug, kategori, jadwal, pemateri')
      .eq('kategori', 'kajian')
      .then(({ data }) => setKajian(data ?? []))
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Kajian</h1>
      <p className="mt-2 text-stone-500">
        Arsip kajian dan kegiatan Masjid Al-Mukhlisin dari Khidmat Channel.
      </p>

      {/* aspect-video = rasio 16:9, supaya video tetap proporsional di HP maupun laptop */}
      <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-stone-200 shadow-lg">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_UPLOAD}`}
          title="Video terbaru Khidmat Channel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <a
        href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
      >
        ▶ Kunjungi Khidmat Channel
      </a>

      <h2 className="mt-14 text-2xl font-bold">Kajian Rutin</h2>
      {kajian.length === 0 && (
        <p className="mt-4 text-stone-500">Belum ada jadwal kajian rutin.</p>
      )}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {kajian.map((k) => (
          <ProgramCard key={k.slug} program={k} />
        ))}
      </div>
    </section>
  )
}