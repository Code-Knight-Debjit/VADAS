import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("vehicle-alert-token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        window.localStorage.removeItem("vehicle-alert-token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials, endpoint) => {
    const response = await api.post(endpoint, credentials);
    window.localStorage.setItem("vehicle-alert-token", response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    window.localStorage.removeItem("vehicle-alert-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
