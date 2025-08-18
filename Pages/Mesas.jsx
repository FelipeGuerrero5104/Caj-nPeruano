// src/components/Mesas.jsx
import { useState } from "react";
import ModalMesa from "../src/components/ModalMesa";

export default function Mesas() {
  const [selectedMesa, setSelectedMesa] = useState(null);

  const primeraFila = [
    { id: 10, shape: "circle" },
    { id: 9, shape: "square" },
    { id: 8, shape: "square" },
    { id: 7, shape: "square" },
    { id: 6, shape: "square" },
    { id: 5, shape: "square" },
    { id: 4, shape: "square" },
    { id: 3, shape: "square" },
    { id: 2, shape: "square" },
    { id: 1, shape: "square" },
  ];

  const segundaFilaIzq = [
    { id: 11, w: "w-14", h: "h-48" },
    { id: 12, w: "w-40", h: "h-14" },
    { id: 13, w: "w-40", h: "h-14" },
    { id: 14, w: "w-14", h: "h-16" },
    { id: 15, w: "w-14", h: "h-16" },
    { id: 16, w: "w-14", h: "h-16" },
  ];

  const segundaFilaDer = [
    { id: 17, shape: "square" },
    { id: 18, shape: "circle" },
    { id: 19, shape: "circle" },
    { id: 20, shape: "square" },
  ];

  const Mesa = ({ id, shape = "square", w = "w-14", h = "h-16" }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setSelectedMesa(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setSelectedMesa(id);
      }}
      className={`bg-gray-500 ${w} ${h} flex items-center justify-center text-white font-bold cursor-pointer hover:bg-gray-700 ${
        shape === "circle" ? "rounded-full" : "rounded-xl"
      }`}
    >
      <p>{id}</p>
    </div>
  );

  return (
    <section className="bg-amber-400 w-full h-screen flex items-center justify-center">
      <div className="bg-amber-200 flex flex-col gap-5 p-4 rounded-lg mb-24">
        {/* Fila superior */}
        <div className="flex gap-4">
          {primeraFila.map((mesa) => (
            <Mesa key={mesa.id} {...mesa} />
          ))}
        </div>

        {/* Segunda fila */}
        <div className="flex justify-between gap-5">
          {/* Izquierda */}
          <div className="flex gap-5">
            <Mesa id={11} w="w-14" h="h-48" />
            <div className="flex flex-col justify-between">
              <Mesa id={12} w="w-40" h="h-14" />
              <Mesa id={13} w="w-40" h="h-14" />
            </div>
            <div className="flex flex-col gap-5">
              <Mesa id={14} />
              <Mesa id={15} />
              <Mesa id={16} />
            </div>
          </div>

          {/* Derecha */}
          <div className="grid grid-cols-2 gap-5">
            {segundaFilaDer.map((mesa) => (
              <Mesa key={mesa.id} {...mesa} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal: se muestra solo si hay una mesa seleccionada */}
      {selectedMesa && (
        <ModalMesa
          idMesa={selectedMesa}
          onClose={() => setSelectedMesa(null)}
        />
      )}
    </section>
  );
}

