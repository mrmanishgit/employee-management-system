import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const emptyForm = { name: "", description: "" };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
      setError("");
    } catch {
      setError("Unable to load departments.");
    }
  };

  useEffect(() => {
    let active = true;

    api
      .get("/departments")
      .then((response) => {
        if (active) {
          setDepartments(response.data);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to load departments.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, form);
      } else {
        await api.post("/departments", form);
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadDepartments();

      // After adding/updating, return to first page
      setCurrentPage(1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save department."
      );
    }
  };

  const editDepartment = (department) => {
    setEditingId(department.id);

    setForm({
      name: department.name,
      description: department.description || "",
    });
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);

      await loadDepartments();

      // Recalculate page after deletion
      const remainingItems = departments.length - 1;
      const newTotalPages = Math.ceil(
        remainingItems / itemsPerPage
      );

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch {
      setError("Unable to delete department.");
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    departments.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentDepartments = departments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Change page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination numbers
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div>
      {/* =====================================================
          PAGE HEADING
      ====================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>Departments</h2>

          <p className="text-muted mb-0">
            Manage company departments
          </p>
        </div>
      </div>

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* =====================================================
          ADD / EDIT DEPARTMENT
      ====================================================== */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId
              ? "Edit Department"
              : "Add Department"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Department Name */}

              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Department Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Description */}

              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Add / Update */}

              <div className="col-md-2">
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </div>

            {/* Cancel Editing */}

            {editingId && (
              <button
                type="button"
                className="btn btn-link px-0 mt-2"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel editing
              </button>
            )}
          </form>
        </div>
      </div>

      {/* =====================================================
          DEPARTMENT TABLE
      ====================================================== */}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
  {currentDepartments.map((department) => (
    <tr key={department.id}>
      <td>{department.id}</td>

      <td>
        <strong>{department.name}</strong>
      </td>

      <td>
        {department.description || "-"}
      </td>

      <td>
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => editDepartment(department)}
        >
          Edit
        </button>

        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => deleteDepartment(department.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}

  {/* Fill empty rows so every page has the same height */}
  {currentDepartments.length > 0 &&
    currentDepartments.length < itemsPerPage &&
    Array.from({
      length: itemsPerPage - currentDepartments.length,
    }).map((_, index) => (
      <tr
        key={`empty-${index}`}
        className="department-empty-row"
      >
        <td colSpan="4"></td>
      </tr>
    ))}

  {departments.length === 0 && (
    <tr>
      <td
        colSpan="4"
        className="text-center py-4"
      >
        No departments found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>

        {/* ===================================================
            PAGINATION
        ==================================================== */}

        {totalPages > 1 && (
          <div className="department-pagination">
            <div className="pagination-info">
              Showing{" "}
              <strong>
                {startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(
                  startIndex + itemsPerPage,
                  departments.length
                )}
              </strong>{" "}
              of{" "}
              <strong>
                {departments.length}
              </strong>{" "}
              departments
            </div>

            <div className="pagination-controls">
              {/* Previous */}

              <button
                type="button"
                className="pagination-btn pagination-arrow"
                disabled={currentPage === 1}
                onClick={goToPreviousPage}
              >
                ‹
              </button>

              {/* Page Numbers */}

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="pagination-dots"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={page}
                    className={`pagination-btn ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      goToPage(page)
                    }
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}

              <button
                type="button"
                className="pagination-btn pagination-arrow"
                disabled={
                  currentPage === totalPages
                }
                onClick={goToNextPage}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}