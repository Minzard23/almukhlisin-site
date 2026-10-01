import { useEffect, useState } from 'react'
import { supabase } from './supabase'

// Hook: memberi tahu apakah admin sedang login
// undefined = masih dicek | null = belum login | object = sudah login
export function useSession() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 1. Cek sesi yang tersimpan saat halaman dibuka
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // 2. Dengarkan perubahan: login, logout, token diperbarui
    const { data } = supabase.auth.onAuthStateChange((_event, sesiBaru) => {
      setSession(sesiBaru)
    })

    // 3. Berhenti mendengarkan saat komponen ditutup
    return () => data.subscription.unsubscribe()
  }, [])

  return session
}