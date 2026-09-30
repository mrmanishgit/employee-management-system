import { useState } from "react";
import AuthContext from "./context";
import api from "../api/axiosConfig";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ems_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, role } = response.data;

    const loggedInUser = {
      email: response.data.email,
      role,
    };

    localStorage.setItem("ems_token", token);
    localStorage.setItem("ems_user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}