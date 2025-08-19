import { createContext, useState, useContext } from "react";

const VentasContext = createContext();

export const VentasProvider = ({ children }) => {
  const [totales, setTotales] = useState([]); // Array de { id_pedido, total }

  const agregarTotal = (pedido) => {
    // Evita duplicados por recarga del mismo pedido
    setTotales((prev) => {
      if (prev.find((p) => p.id_pedido === pedido.id_pedido)) return prev;
      return [...prev, { id_pedido: pedido.id_pedido, total: pedido.total }];
    });
  };

  return (
    <VentasContext.Provider value={{ totales, agregarTotal }}>
      {children}
    </VentasContext.Provider>
  );
};

export const useVentas = () => useContext(VentasContext);
