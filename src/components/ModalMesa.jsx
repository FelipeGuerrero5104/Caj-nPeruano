import { useEffect, useState } from "react";
import { supabase } from "../Hooks/supabase";

export default function ModalMesa({ idMesa, onClose }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!idMesa) return;
    fetchPedidos();
  }, [idMesa]);

  const fetchPedidos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase
        .from("pedidos")
        .select(`
          id_pedido,
          fecha,
          estado,
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
        .order("fecha", { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setErrorMsg("Error cargando pedidos (revisa consola).");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Acción imprimir
  const handleImprimir = () => {
    const ventana = window.open("", "_blank");
    ventana.document.write("<html><head><title>Comanda</title></head><body>");
    ventana.document.write(`<h2>Mesa ${idMesa}</h2>`);

    pedidos.forEach((pedido) => {
      ventana.document.write(`<h3>Pedido #${pedido.id_pedido}</h3>`);
      ventana.document.write(`<p>Fecha: ${new Date(pedido.fecha).toLocaleString()}</p>`);
      ventana.document.write("<ul>");
      pedido.pedido_detalle?.forEach((det) => {
        ventana.document.write(
          `<li>${det.cantidad} × ${det.productos?.nombre ?? `#${det.id_producto}`} - $${det.subtotal}</li>`
        );
      });
      ventana.document.write("</ul>");
      // Total calculado dinámicamente
      const totalCalculado = pedido.pedido_detalle?.reduce(
        (sum, det) => sum + Number(det.subtotal), 0
      ) ?? 0;
      ventana.document.write(`<p><b>Total: $${totalCalculado}</b></p>`);
    });

    ventana.document.write("</body></html>");
    ventana.document.close();
    ventana.print();
  };

  // 🔹 Acción cambiar estado a "pagado"
  const handlePagado = async () => {
    try {
      const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente");
      if (pedidosPendientes.length === 0) {
        alert("No hay pedidos pendientes para esta mesa.");
        return;
      }

      const ids = pedidosPendientes.map((p) => p.id_pedido);

      const { error } = await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .in("id_pedido", ids);

      if (error) throw error;

      alert("✅ Pedido marcado como pagado.");
      fetchPedidos(); // refrescar datos
    } catch (err) {
      console.error("Error cambiando estado:", err);
      alert("❌ Error al cambiar estado.");
    }
  };

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
          pedidos.map((pedido) => {
            const totalCalculado = pedido.pedido_detalle?.reduce(
              (sum, det) => sum + Number(det.subtotal), 0
            ) ?? 0;

            return (
              <div key={pedido.id_pedido} className="mb-4 border-b pb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="font-semibold">Pedido #{pedido.id_pedido}</p>
                    <p className="text-sm text-gray-500">
                      Fecha: {new Date(pedido.fecha).toLocaleString()}
                    </p>
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

                <div className="mt-2 text-right font-bold">Total: ${totalCalculado}</div>
              </div>
            );
          })}

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleImprimir}
            className="rounded-lg text-lg font-semibold px-4 py-2 bg-amber-200 hover:bg-amber-600"
          >
            Imprimir
          </button>
          <button
            onClick={handlePagado}
            className="rounded-lg text-lg font-semibold px-4 py-2 bg-amber-200 hover:bg-amber-600"
          >
            Pagado
          </button>
        </div>
      </div>
    </div>
  );
}


