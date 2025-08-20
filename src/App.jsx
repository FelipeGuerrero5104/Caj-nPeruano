import { Route, Routes } from "react-router-dom"
import Ingresos from "./Pages/Ingresos"
import Inventario from "./Pages/Inventario"
import Mesas from "./Pages/Mesas"
import NavBar from "./components/NavBar"

export default function App(){
  return(
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Mesas/>}/>
        <Route path="/Inventario" element={<Inventario/>}/>
        <Route path="/Ingresos" element={<Ingresos/>}/>
      </Routes>
    </div>
  )
}
