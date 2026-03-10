import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me } from "../services/authService.js";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await me();
        setUser(data?.user || null);
      } catch {
        setUser(null);
      }
    };
    init();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2800);
  };

  const value = useMemo(
    () => ({ theme, setTheme, user, setUser, toast, showToast }),
    [theme, user, toast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

