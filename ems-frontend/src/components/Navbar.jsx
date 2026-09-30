import useAuth from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3">
      <span className="navbar-brand fw-bold text-primary">
        <i className="bi bi-people-fill me-2"></i>
        EMS Portal
      </span>

      <div className="ms-auto d-flex align-items-center gap-3">
        <div className="text-end">
          <div className="fw-semibold">{user?.email}</div>
          <small className="text-muted">{user?.role}</small>
        </div>

        <button className="btn btn-outline-danger btn-sm" onClick={logout}>
          <i className="bi bi-box-arrow-right me-1"></i>
          Logout
        </button>
      </div>
    </nav>
  );
}