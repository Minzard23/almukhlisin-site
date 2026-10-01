import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Beranda from './pages/Beranda'
import Program from './pages/Program'
import ProgramDetail from './pages/ProgramDetail'
import Kajian from './pages/Kajian'
import Studio from './pages/Studio'
import KasWakaf from './pages/KasWakaf'
import Tentang from './pages/Tentang'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Pendaftar from './pages/admin/Pendaftar'
import Booking from './pages/admin/Booking'
import ProgramAdmin from './pages/admin/ProgramAdmin'
import Kas from './pages/admin/Kas'

export default function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/program" element={<Program />} />
        <Route path="/program/:slug" element={<ProgramDetail />} />
        <Route path="/kajian" element={<Kajian />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/kas-wakaf" element={<KasWakaf />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Halaman admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pendaftar" element={<Pendaftar />} />
        <Route path="booking" element={<Booking />} />
        <Route path="program" element={<ProgramAdmin />} />
        <Route path="kas" element={<Kas />} />
      </Route>
    </Routes>
  )
}