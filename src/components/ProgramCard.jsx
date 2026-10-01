import { Link } from 'react-router'

export default function ProgramCard({ program }) {
  return (
    <Link
      to={`/program/${program.slug}`}
      className="rounded-2xl bg-white p-5 ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-800">
        {program.kategori}
      </span>
      <h3 className="mt-3 text-lg font-bold">{program.judul}</h3>
      <p className="mt-1 text-sm text-stone-500">{program.jadwal}</p>
      <p className="mt-3 text-sm text-stone-600">{program.pemateri}</p>
    </Link>
  )
}
