import { Link } from "react-router-dom"
import Logo from "./logo"

export default function NavBar(){
    return(
        <nav className="flex items-center justify-between gap-4 p-3 bg-gradient-to-r from-[#432818] to-amber-700  min-h-4 w-full">
            <Logo/>
            <div className="flex items-center justify-between gap-5 md:text-2xl font-semibold text-white ">
            <Link to="/" className="hover:text-yellow-400">Mesas </Link>
            <Link to="/Ingresos" className="hover:text-yellow-400">Ingresos </Link>
            <Link to="Inventario" className="hover:text-yellow-400">Inventario </Link>
            </div>
        </nav>
    )
}