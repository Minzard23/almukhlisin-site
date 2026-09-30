import { Outlet } from "react-router";
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-stone-50 text-stone-800">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}