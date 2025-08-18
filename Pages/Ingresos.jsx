import { useState } from "react";
import { supabase } from "../src/Hooks/supabase";

export default function Ingresos() {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [boleta, setBoleta] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleIngreso = async (e) => {
    e.preventDefault();

    if (!codigo || !cantidad || !boleta || Number(cantidad) <= 0) {
      setMensaje("Ingresa un código, cantidad y número de boleta válidos");
      return;
    }

    // Verificar que el producto exista
    const { data: producto, error: prodError } = await supabase
      .from("productos")
      .select("id_producto, stock_actual")
      .eq("id_producto", Number(codigo))
      .single();

    if (prodError || !producto) {
      setMensaje("Producto no encontrado");
      return;
    }

    // Actualizar stock
    const nuevaCantidad = producto.stock_actual + Number(cantidad);
    const { error: updateError } = await supabase
      .from("productos")
      .update({ stock_actual: nuevaCantidad })
      .eq("id_producto", Number(codigo));

    if (updateError) {
      setMensaje("Error al actualizar el stock");
      return;
    }

    // Insertar en movimientos_inventario
    const { error: movError } = await supabase
      .from("movimientos_inventario")
      .insert([
        {
          id_producto: Number(codigo),
          tipo: "entrada",
          cantidad: Number(cantidad),
          motivo: `Ingreso boleta #${boleta}`,
        },
      ]);

    if (movError) {
      setMensaje("Stock actualizado, pero error al registrar movimiento");
    } else {
      setMensaje(
        `Stock actualizado: ${producto.stock_actual} → ${nuevaCantidad} (Boleta #${boleta})`
      );
      setCodigo("");
      setCantidad("");
      setBoleta("");
    }
  };

  return (
    <div className="p-6 bg-amber-400 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Ingresos de Productos</h2>
      <form onSubmit={handleIngreso} className="space-y-4 bg-amber-200 w-[500px] h-[350px] flex flex-col items-center justify-center rounded-lg">
        <div>
          <label className="block font-semibold mb-1 text-lg">Código de producto:</label>
          <input
            type="number"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="border rounded px-2 py-1 "
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-lg">Cantidad a ingresar:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="border rounded px-2 py-1 "
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-lg">Número de boleta:</label>
          <input
            type="text"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
            className="border rounded px-2 py-1 "
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
        >
          Ingresar
        </button>
      </form>

      {mensaje && <p className="mt-4 text-gray-700">{mensaje}</p>}
    </div>
  );
}
