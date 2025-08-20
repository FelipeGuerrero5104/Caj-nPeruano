import { useState } from "react";
import { supabase } from "/src/Hooks/supabase";

export default function Ingresos() {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [boleta, setBoleta] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleIngreso = async (e) => {
    e.preventDefault();
    console.log("=== NUEVO INGRESO EJECUTADO ===");
    console.log("Datos recibidos:", { codigo, cantidad, boleta });

    if (!codigo || !cantidad || !boleta || Number(cantidad) <= 0) {
      setMensaje("Ingresa un código, cantidad y número de boleta válidos");
      console.log("❌ Validación fallida");
      return;
    }

    // Verificar que el producto exista
    const { data: producto, error: prodError } = await supabase
      .from("productos")
      .select("id_producto, stock_actual")
      .eq("id_producto", Number(codigo))
      .single();

    console.log("Producto encontrado:", producto, "Error:", prodError);

    if (prodError || !producto) {
      setMensaje("Producto no encontrado");
      return;
    }

    // Insertar en movimientos_inventario (el trigger se encarga del stock)
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
      console.log("❌ Error al registrar movimiento:", movError);
      setMensaje("Error al registrar movimiento");
    } else {
      console.log("✅ Movimiento registrado correctamente");
      setMensaje(
        `Ingreso registrado correctamente (Boleta #${boleta}).stock Actualizado`
      );
      setCodigo("");
      setCantidad("");
      setBoleta("");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-amber-400 to-amber-500 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Ingresos de Productos</h2>
      <form
        onSubmit={handleIngreso}
        className="space-y-4 bg-gradient-to-r from-amber-300 to-amber-200 w-[500px] h-[350px] flex flex-col items-center justify-center rounded-lg"
      >
        <div>
          <label className="block font-semibold mb-1 text-lg">
            Código de producto:
          </label>
          <input
            type="number"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="border rounded px-2 py-1 "
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-lg">
            Cantidad a ingresar:
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="border rounded px-2 py-1 "
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-lg">
            Número de boleta:
          </label>
          <input
            type="text"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
            className="border rounded px-2 py-1 "
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold px-4 py-2 rounded hover:from-amber-600 hover:to-amber-700"
        >
          Ingresar
        </button>
      </form>

      {mensaje && <p className="mt-4 text-gray-700">{mensaje}</p>}
    </div>
  );
}
