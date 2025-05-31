import React, { createContext, useContext } from "react";

interface AppContextType {
  apiKey: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiKey = process.env.REACT_APP_API_KEY || "";
  return (
    <AppContext.Provider value={{ apiKey }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
