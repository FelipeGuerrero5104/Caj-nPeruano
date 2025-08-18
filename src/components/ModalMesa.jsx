// src/components/ModalMesa.jsx
import { useEffect, useState } from "react";
import { supabase } from "../Hooks/supabase";

export default function ModalMesa({ idMesa, onClose }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!idMesa) return;

    const fetchPedidos = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // Traemos pedidos de la mesa junto con sus detalles y nombre de producto
        const { data, error } = await supabase
          .from("pedidos")
          .select(`
            id_pedido,
            fecha,
            estado,
            total,
            pedido_detalle (
              id_detalle,
              id_producto,
              cantidad,
              precio_unitario,
              subtotal,
              productos (
                id_producto,
                nombre
              )
            )
          `)
          .eq("id_mesa", idMesa)
          .order("fecha", { ascending: false }); // pedidos más recientes primero

        if (error) {
          throw error;
        }
        setPedidos(data || []);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
        setErrorMsg("Error cargando pedidos (revisa consola).");
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [idMesa]);

  if (!idMesa) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-amber-400 rounded-xl shadow-lg p-6 w-[92%] max-w-xl max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-3 text-amber-700">Mesa {idMesa}</h2>

        {loading && <p className="text-gray-500 font-semibold">Cargando pedidos...</p>}
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        {!loading && pedidos.length === 0 && (
          <p className="text-gray-500 font-semibold">No hay pedidos para esta mesa.</p>
        )}

        {!loading &&
          pedidos.map((pedido) => (
            <div key={pedido.id_pedido} className="mb-4 border-b pb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="font-semibold">Pedido #{pedido.id_pedido}</p>
                  <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Estado:</p>
                  <p className="font-bold">{pedido.estado}</p>
                </div>
              </div>

              <ul className="mt-2 ml-2 list-disc">
                {pedido.pedido_detalle && pedido.pedido_detalle.length > 0 ? (
                  pedido.pedido_detalle.map((det) => (
                    <li key={det.id_detalle} className="flex justify-between">
                      <span>
                        {det.cantidad} × {det.productos?.nombre ?? `#${det.id_producto}`}
                      </span>
                      <span className="font-medium">${det.subtotal}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">Sin detalles</li>
                )}
              </ul>

              <div className="mt-2 text-right font-bold">Total: ${pedido.total}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

