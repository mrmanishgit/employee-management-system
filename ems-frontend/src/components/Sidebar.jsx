import { NavLink } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar-link">
        <i className="bi bi-speedometer2"></i>
        Dashboard
      </NavLink>

      <NavLink to="/employees" className="sidebar-link">
        <i className="bi bi-people"></i>
        Employees
      </NavLink>

      {user?.role === "ADMIN" && (
        <NavLink to="/departments" className="sidebar-link">
          <i className="bi bi-building"></i>
          Departments
        </NavLink>
      )}
    </aside>
  );
}