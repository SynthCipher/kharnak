import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [role, setRole] = useState(
    localStorage.getItem("role") ? localStorage.getItem("role") : "user" // Default to safe role
  );
  const currency = "₹";
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const value = {
    backendUrl,
    token,
    setToken,
    navigate,
    currency,
    role,
    setRole
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
