import { useState } from "react";
import ModalMesa from "../components/ModalMesa";
import ModalCierreJornada from "../components/ModalCierreJornada";
import { VentasProvider } from "../Hooks/VentasContext";
import { supabase } from "../Hooks/supabase";

export default function Mesas() {
  return (
    <VentasProvider>
      <MesasInterno />
    </VentasProvider>
  );
}

function MesasInterno() {
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showCierre, setShowCierre] = useState(false);

  const primeraFila = [
    { id: 10, shape: "circle" }, { id: 9, shape: "square" },
    { id: 8, shape: "square" }, { id: 7, shape: "square" },
    { id: 6, shape: "square" }, { id: 5, shape: "square" },
    { id: 4, shape: "square" }, { id: 3, shape: "square" },
    { id: 2, shape: "square" }, { id: 1, shape: "square" },
  ];

  const segundaFilaDer = [
    { id: 17, shape: "square" }, { id: 18, shape: "circle" },
    { id: 19, shape: "circle" }, { id: 20, shape: "square" },
  ];

  const Mesa = ({ id, shape = "square", w = "w-14", h = "h-16" }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setSelectedMesa(id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedMesa(id); }}
      className={`bg-gray-500 ${w} ${h} flex items-center justify-center text-white font-bold cursor-pointer hover:bg-gray-700 ${shape === "circle" ? "rounded-full" : "rounded-xl"}`}
    >
      <p>{id}</p>
    </div>
  );

  const reiniciarMesas = async () => {
    try {
      const { error: detalleError } = await supabase.from("pedido_detalle").delete().neq("id_detalle", 0);
      if (detalleError) throw detalleError;
      const { error: pedidosError } = await supabase.from("pedidos").delete().neq("id_pedido", 0);
      if (pedidosError) throw pedidosError;
      alert("✅ Todas las mesas fueron reiniciadas");
    } catch (err) {
      console.error("Error reiniciando mesas:", err.message);
      alert("❌ Hubo un error al reiniciar las mesas");
    }
  };

  return (
    <section className="bg-gradient-to-r from-amber-400 to-amber-500 w-full h-screen flex flex-col items-center justify-center">
      <div className="bg-gradient-to-r from-amber-300 to-amber-200 flex flex-col gap-5 p-4 rounded-lg mb-24">
        <div className="flex gap-4">
          {primeraFila.map((mesa) => <Mesa key={mesa.id} {...mesa} />)}
        </div>
        <div className="flex justify-between gap-5">
          <div className="flex gap-5">
            <Mesa id={11} w="w-14" h="h-48" />
            <div className="flex flex-col justify-between">
              <Mesa id={12} w="w-40" h="h-14" />
              <Mesa id={13} w="w-40" h="h-14" />
            </div>
            <div className="flex flex-col gap-5">
              <Mesa id={14} /> <Mesa id={15} /> <Mesa id={16} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {segundaFilaDer.map((mesa) => <Mesa key={mesa.id} {...mesa} />)}
          </div>
        </div>
      </div>

      {selectedMesa && <ModalMesa idMesa={selectedMesa} onClose={() => setSelectedMesa(null)} />}
      {showCierre && <ModalCierreJornada onCancel={() => setShowCierre(false)} onConfirm={reiniciarMesas} />}

      <button
        onClick={() => setShowCierre(true)}
        className="border border-white rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-3xl p-3 hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
      >
        Cerrar Jornada
      </button>
    </section>
  );
}
