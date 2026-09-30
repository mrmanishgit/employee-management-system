import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import useAuth from "../context/useAuth";

export default function Employees() {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 10;

  // Load employees when the page opens
  useEffect(() => {
    let active = true;

    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");

        if (active) {
          setEmployees(response.data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load employees."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      active = false;
    };
  }, []);

  // Refresh employee list after deleting
  const refreshEmployees = async () => {
    try {
      const response = await api.get("/employees");

      setEmployees(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to refresh employees."
      );
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/employees/${id}`);
      await refreshEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete employee."
      );
    }
  };

  // Search employees by name or email
  const filteredEmployees = employees.filter((employee) => {
    const fullName =
      `${employee.firstName || ""} ${employee.lastName || ""} ${employee.department}`.toLowerCase();

    const email = (employee.email || "").toLowerCase();

    const query = search.toLowerCase().trim();

    return (
      fullName.includes(query) ||
      email.includes(query)
    );
  });

  // ============================================
  // PAGINATION
  // ============================================

  const totalPages = Math.ceil(
    filteredEmployees.length / employeesPerPage
  );

  /*
   * If the current page becomes greater than
   * total pages after deleting/searching,
   * display the last available page.
   */
  const displayPage =
    totalPages === 0
      ? 1
      : Math.min(currentPage, totalPages);

  const indexOfFirstEmployee =
    (displayPage - 1) * employeesPerPage;

  const indexOfLastEmployee =
    indexOfFirstEmployee + employeesPerPage;

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Go to selected page
  const goToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      setCurrentPage(pageNumber);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div>

      {/* ======================================
          PAGE HEADING
      ======================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>
          <h2>Employees</h2>

          <p className="text-muted mb-0">
            Manage company employees
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <Link
            to="/employees/new"
            className="btn btn-primary"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add Employee
          </Link>
        )}

      </div>


      {/* ======================================
          ERROR MESSAGE
      ======================================= */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {/* ======================================
          EMPLOYEE CARD
      ======================================= */}

      <div className="card border-0 shadow-sm employee-card">

        <div className="card-body">

          {/* ==================================
              SEARCH
          =================================== */}

          <div className="row mb-4">

            <div className="col-md-6">

              <input
                type="text"
                className="form-control"
                placeholder="Search by employee name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);

                  // When searching, always go
                  // back to page 1
                  setCurrentPage(1);
                }}
              />

            </div>

          </div>


          {/* ==================================
              LOADING
          =================================== */}

          {loading ? (

            <div className="text-center py-4">
              Loading employees...
            </div>

          ) : (

            <>

              {/* ==================================
                  TABLE
              =================================== */}

              <div className="table-responsive employee-table-wrapper">

                <table className="table table-hover align-middle">

                  <thead>

                    <tr>

                      <th>
                        ID
                      </th>

                      <th>
                        Name
                      </th>

                      <th>
                        Email
                      </th>

                      <th>
                        Phone
                      </th>

                      <th>
                        Designation
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Salary
                      </th>

                      <th>
                        Joining Date
                      </th>

                      {user?.role === "ADMIN" && (
                        <th>
                          Actions
                        </th>
                      )}

                    </tr>

                  </thead>


                  <tbody>

                    {/* ==================================
                        EMPLOYEE ROWS
                    =================================== */}

                    {currentEmployees.map((employee) => (

                      <tr key={employee.id}>

                        {/* ID */}
                        <td>
                          {employee.id}
                        </td>


                        {/* NAME */}
                        <td>
                          {employee.firstName}{" "}
                          {employee.lastName}
                        </td>


                        {/* EMAIL */}
                        <td>
                          {employee.email}
                        </td>


                        {/* PHONE */}
                        <td>
                          {employee.phone || "-"}
                        </td>


                        {/* DESIGNATION */}
                        <td>
                          {employee.designation || "-"}
                        </td>


                        {/* DEPARTMENT */}
                        <td>
                          {employee.department?.name || "-"}
                        </td>


                        {/* SALARY */}
                        <td>
                          {employee.salary != null
                            ? `₹${Number(
                                employee.salary
                              ).toLocaleString("en-IN")}`
                            : "-"}
                        </td>


                        {/* JOINING DATE */}
                        <td>
                          {employee.joiningDate
                            ? new Date(
                                employee.joiningDate
                              ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>


                        {/* ACTIONS */}
                        {user?.role === "ADMIN" && (

                          <td>

                            <Link
                              to={`/employees/edit/${employee.id}`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="bi bi-pencil"></i>{" "}
                              Edit
                            </Link>


                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                deleteEmployee(
                                  employee.id
                                )
                              }
                            >
                              <i className="bi bi-trash"></i>{" "}
                              Delete
                            </button>

                          </td>

                        )}

                      </tr>

                    ))}


                    {/* ==================================
                        NO EMPLOYEES
                    =================================== */}

                    {filteredEmployees.length === 0 && (

                      <tr>

                        <td
                          colSpan={
                            user?.role === "ADMIN"
                              ? 9
                              : 8
                          }
                          className="text-center py-4"
                        >

                          {search
                            ? "No matching employees found."
                            : "No employees found."}

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>


              {/* ==================================
                  PAGINATION
              =================================== */}

              {totalPages > 1 && (

                <div className="employee-pagination">

                  {/* PREVIOUS BUTTON */}

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={displayPage === 1}
                    onClick={() =>
                      goToPage(displayPage - 1)
                    }
                  >
                    &lt;
                  </button>


                  {/* PAGE NUMBERS */}

                {(() => {
                  const pages = [];

                  if (totalPages <= 4) {
                    // If there are only a few pages, show all pages
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Show current page + next page + last page
                    pages.push(displayPage);

                    if (displayPage + 1 < totalPages) {
                      pages.push(displayPage + 1);
                    }

                    // Add last page
                    if (!pages.includes(totalPages)) {
                      pages.push("...");
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="pagination-dots"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        type="button"
                        key={page}
                        className={`pagination-btn ${
                          displayPage === page ? "active" : ""
                        }`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}


                  {/* NEXT BUTTON */}

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={
                      displayPage === totalPages
                    }
                    onClick={() =>
                      goToPage(displayPage + 1)
                    }
                  >
                    &gt;
                  </button>

                </div>

              )}


              {/* ==================================
                  SHOWING RECORD INFORMATION
              =================================== */}

              {filteredEmployees.length > 0 && (

                <div className="text-muted small mt-2">

                  Showing{" "}

                  {indexOfFirstEmployee + 1}

                  {"-"}

                  {Math.min(
                    indexOfLastEmployee,
                    filteredEmployees.length
                  )}

                  {" of "}

                  {filteredEmployees.length}

                  {" employees"}

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </div>
  );
}