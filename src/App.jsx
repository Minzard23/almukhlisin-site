import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Program from './pages/Program'
import ProgramDetail from './pages/ProgramDetail'
import Kajian from './pages/Kajian'
import Studio from './pages/Studio'
import KasWakaf from './pages/KasWakaf'
import Tentang from './pages/Tentang'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
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
    </Routes>
  )
}