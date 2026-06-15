/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const storedLoc = localStorage.getItem("userLocation");
    if (storedLoc) return storedLoc;
    localStorage.setItem("userLocation", "Kochi");
    return "Kochi";
  });

  const changeLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("userLocation", newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, changeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocationContext must be used within LocationProvider");
  return context;
};
