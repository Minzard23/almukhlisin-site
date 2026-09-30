import {useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function app () {
  const [programs, setPrograms] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
    .from('programs')
    .select('judul, jadwal')
    .then (({ data, error }) => {
      if (error) setError(error.message)
      else setPrograms(data)
    })
  }, [])

  return (
    <main className='min-h-screen bg-stone-900 text-stone-100 p-8'>
      <h1 className='text-3xl font-bold mb-6'>Tes Koneksi Supabase ✅</h1>
      {error && <p className='text-red-400'>Error: {error}</p>}
      <ul className='space-y-3'>
        {programs.map((p) => (
          <li key={p.judul} className='rounded-lg bg-stone-800 p-4'>
            <p className='font-semibold'>{p.judul}</p>
            <p className='text-sm text-stone-400'>{p.jadwal}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
