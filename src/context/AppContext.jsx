import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedServices, setSelectedServices] = useState([]);

  function addService(service) {
    setSelectedServices((prev) => {
      if (prev.find((s) => s.id === service.id)) {
        return prev;
      }
      return [...prev, service];
    });
  }

  function removeService(serviceId) {
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
  }

  return (
    <AppContext.Provider value={{ selectedServices, addService, removeService }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  return useContext(AppContext);
}
