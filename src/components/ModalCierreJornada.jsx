import { useVentas } from "../Hooks/VentasContext";

export default function ModalCierreJornada({ onConfirm, onCancel }) {
  const { totales } = useVentas();

  const totalDia = totales.reduce((sum, v) => sum + Number(v.total), 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-lg max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4 text-amber-700">
          Resumen de ventas del día
        </h2>

        {totales.length === 0 && (
          <p className="text-gray-500">No hay ventas registradas.</p>
        )}

        {totales.length > 0 && (
          <>
            <ul className="divide-y divide-gray-300">
              {totales.map((v) => (
                <li key={v.id_pedido} className="py-2 flex justify-between">
                  <span>Pedido #{v.id_pedido}</span>
                  <span className="font-semibold">${v.total}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-bold text-lg">
              Total del día: ${totalDia}
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Confirmar Cierre
          </button>
        </div>
      </div>
    </div>
  );
}
