import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState("Kochi"); // Default location

  useEffect(() => {
    const storedLoc = localStorage.getItem("userLocation");
    if (storedLoc) {
      setLocation(storedLoc);
    } else {
      localStorage.setItem("userLocation", "Kochi");
    }
  }, []);

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
