import { useEffect, useState } from "react";
import { supabase } from "../src/Hooks/supabase";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("todas");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase
        .from("productos")
        .select("id_producto, nombre, stock_actual, categoria");

      if (error) {
        console.error("Error al obtener productos:", error);
      } else {
        setProductos(data);
        const catUnicas = ["TODAS", ...new Set(data.map((p) => p.categoria))];
        setCategorias(catUnicas);
      }
      setLoading(false);
    }

    fetchProductos();
  }, []);

  if (loading) return <p className="text-gray-500">Cargando productos...</p>;

  const productosFiltrados =
    categoria === "TODAS"
      ? productos
      : productos.filter((p) => p.categoria === categoria);

  return (
    <div className="p-6 bg-amber-400 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Inventario</h2>

      {/* Selector de categoría */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrar por categoría:</label>
        <select
          className="border border-black bg-amber-700 rounded px-2 py-1 text-white font-semibold"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cabecera de columnas */}
      <div className="grid grid-cols-4 gap-4 font-semibold border-b-2 pb-2 mb-2">
        <div>Codigo Producto</div>
        <div>Nombre</div>
        <div>Stock</div>
        <div>Categoría</div>
      </div>

      {/* Productos */}
      {productosFiltrados.map((prod) => (
        <div
          key={prod.id_producto}
          className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200 hover:bg-amber-300"
        >
          <div>{prod.id_producto}</div>
          <div>{prod.nombre}</div>
          <div className={prod.stock_actual < 10 ? "text-red-600 font-bold" : ""}>
            {prod.stock_actual}
          </div>
          <div>{prod.categoria}</div>
        </div>
      ))}
    </div>
  );
}

