import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import useAuth from "../context/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // LOAD DASHBOARD DATA
  // ============================================

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const [employeeResponse, departmentResponse] =
          await Promise.all([
            api.get("/employees"),
            api.get("/departments"),
          ]);

        if (active) {
          setEmployees(employeeResponse.data || []);
          setDepartments(departmentResponse.data || []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  // ============================================
  // STATISTICS
  // ============================================

  const totalEmployees = employees.length;

  const totalDepartments = departments.length;

  const averageSalary = useMemo(() => {
    const validEmployees = employees.filter(
      (employee) =>
        employee.salary !== null &&
        employee.salary !== undefined &&
        !isNaN(Number(employee.salary))
    );

    if (validEmployees.length === 0) {
      return 0;
    }

    const totalSalary = validEmployees.reduce(
      (total, employee) =>
        total + Number(employee.salary),
      0
    );

    return totalSalary / validEmployees.length;
  }, [employees]);

  // ============================================
  // NEW JOINERS
  // ============================================

  const newJoiners = useMemo(() => {
    const now = new Date();

    return employees.filter((employee) => {
      if (!employee.joiningDate) {
        return false;
      }

      const joiningDate = new Date(employee.joiningDate);

      return (
        joiningDate.getMonth() === now.getMonth() &&
        joiningDate.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [employees]);

  // ============================================
  // DEPARTMENT STATISTICS
  // ============================================

  const departmentStats = useMemo(() => {
    return departments
      .map((department) => {
        const count = employees.filter(
          (employee) =>
            employee.department?.id === department.id
        ).length;

        return {
          ...department,
          employeeCount: count,
        };
      })
      .sort(
        (a, b) =>
          b.employeeCount - a.employeeCount
      );
  }, [departments, employees]);

  // ============================================
  // RECENT EMPLOYEES
  // ============================================

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort((a, b) => {
        const dateA = a.joiningDate
          ? new Date(a.joiningDate)
          : new Date(0);

        const dateB = b.joiningDate
          ? new Date(b.joiningDate)
          : new Date(0);

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [employees]);

  // ============================================
  // CURRENCY
  // ============================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      isNaN(Number(value))
    ) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  // ============================================
  // DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  // ============================================
  // DEPARTMENT ICON
  // ============================================

  const getDepartmentIcon = (name) => {
    const departmentName = name?.toLowerCase() || "";

    if (departmentName.includes("it")) {
      return "bi bi-laptop";
    }

    if (departmentName.includes("hr")) {
      return "bi bi-people";
    }

    if (departmentName.includes("finance")) {
      return "bi bi-bar-chart";
    }

    if (departmentName.includes("sales")) {
      return "bi bi-bullseye";
    }

    if (departmentName.includes("marketing")) {
      return "bi bi-megaphone";
    }

    if (departmentName.includes("support")) {
      return "bi bi-headset";
    }

    if (departmentName.includes("operation")) {
      return "bi bi-gear";
    }

    if (departmentName.includes("bpo")) {
      return "bi bi-buildings";
    }

    return "bi bi-building";
  };

  // ============================================
  // DEPARTMENT COLOR
  // ============================================

  const getDepartmentColor = (index) => {
    const colors = [
      "blue",
      "green",
      "purple",
      "orange",
      "pink",
      "cyan",
      "indigo",
      "teal",
    ];

    return colors[index % colors.length];
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loader">
          <div className="spinner-border text-primary"></div>
        </div>

        <h5>Loading Dashboard</h5>

        <p>
          Preparing your employee management overview...
        </p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="dashboard-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="dashboard-heading">

        <div className="dashboard-title-area">

          <div className="dashboard-welcome">
            Welcome back, {user?.role || "User"}
          </div>

          <h2>Dashboard</h2>

          <p>
            Employee Management Overview
          </p>

        </div>

        {user?.role === "ADMIN" && (
          <div className="dashboard-actions">

            <Link
              to="/employees/new"
              className="dashboard-primary-btn"
            >
              <i className="bi bi-person-plus-fill"></i>
              Add Employee
            </Link>

            <Link
              to="/departments"
              className="dashboard-secondary-btn"
            >
              <i className="bi bi-building"></i>
              Departments
            </Link>

          </div>
        )}

      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="dashboard-error">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="dashboard-stats">

        {/* TOTAL EMPLOYEES */}

        <div className="dashboard-stat-card stat-blue">

          <div className="stat-icon blue">
            <i className="bi bi-people-fill"></i>
          </div>

          <div className="stat-content">

            <span>Total Employees</span>

            <strong>
              {totalEmployees}
            </strong>

            <small>
              <i className="bi bi-person-check-fill"></i>
              Active employee records
            </small>

          </div>

        </div>

        {/* DEPARTMENTS */}

        <div className="dashboard-stat-card stat-green">

          <div className="stat-icon green">
            <i className="bi bi-building"></i>
          </div>

          <div className="stat-content">

            <span>Departments</span>

            <strong>
              {totalDepartments}
            </strong>

            <small>
              <i className="bi bi-diagram-3-fill"></i>
              Company departments
            </small>

          </div>

        </div>

        {/* AVERAGE SALARY */}

        <div className="dashboard-stat-card stat-purple">

          <div className="stat-icon purple">
            <i className="bi bi-cash-stack"></i>
          </div>

          <div className="stat-content">

            <span>Average Salary</span>

            <strong>
              {formatCurrency(averageSalary)}
            </strong>

            <small>
              <i className="bi bi-graph-up-arrow"></i>
              Across employees
            </small>

          </div>

        </div>

        {/* NEW JOINERS */}

        <div className="dashboard-stat-card stat-orange">

          <div className="stat-icon orange">
            <i className="bi bi-person-plus-fill"></i>
          </div>

          <div className="stat-content">

            <span>New Joiners</span>

            <strong>
              {newJoiners}
            </strong>

            <small>
              <i className="bi bi-calendar-check"></i>
              Joined this month
            </small>

          </div>

        </div>

      </div>

      {/* ========================================
          MAIN DASHBOARD GRID
      ======================================== */}

      <div className="dashboard-grid">

        {/* ======================================
            DEPARTMENT OVERVIEW
        ======================================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h5>
                Department Overview
              </h5>

              <span>
                Employees by department
              </span>
            </div>

            <Link
              to="/departments"
              className="panel-link"
            >
              View All
              <i className="bi bi-arrow-right"></i>
            </Link>

          </div>

          <div className="department-list">

            {departmentStats.length === 0 ? (

              <div className="empty-state">
                <i className="bi bi-building"></i>
                <p>No departments found.</p>
              </div>

            ) : (

              departmentStats
                .slice(0, 8)
                .map((department, index) => {

                  /*
                   * Percentage is based on TOTAL EMPLOYEES.
                   * This prevents every department from
                   * becoming 100% when counts are equal.
                   */

                  const percentage =
                    totalEmployees > 0
                      ? Math.round(
                          (department.employeeCount /
                            totalEmployees) *
                            100
                        )
                      : 0;

                  const color =
                    getDepartmentColor(index);

                  return (
                    <div
                      className="department-item"
                      key={department.id}
                    >

                      <div className="department-info">

                        <div
                          className={`department-icon ${color}`}
                        >
                          <i
                            className={getDepartmentIcon(
                              department.name
                            )}
                          ></i>
                        </div>

                        <div className="department-name">

                          <strong>
                            {department.name}
                          </strong>

                          <span>
                            {department.employeeCount}{" "}
                            employee
                            {department.employeeCount !== 1
                              ? "s"
                              : ""}
                          </span>

                        </div>

                      </div>

                      <div className="department-progress-area">

                        <div className="department-progress">

                          <div
                            className={`department-progress-bar ${color}`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>

                        </div>

                        <span className="department-percentage">
                          {percentage}%
                        </span>

                      </div>

                    </div>
                  );
                })

            )}

          </div>

        </div>

        {/* ======================================
            QUICK ACTIONS
        ======================================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h5>
                Quick Actions
              </h5>

              <span>
                Frequently used actions
              </span>
            </div>

          </div>

          <div className="quick-actions">

            {user?.role === "ADMIN" && (

              <Link
                to="/employees/new"
                className="quick-action"
              >

                <div className="quick-action-icon blue">
                  <i className="bi bi-person-plus-fill"></i>
                </div>

                <div>
                  <strong>
                    Add Employee
                  </strong>

                  <span>
                    Create a new employee record
                  </span>
                </div>

                <i className="bi bi-chevron-right"></i>

              </Link>

            )}

            <Link
              to="/employees"
              className="quick-action"
            >

              <div className="quick-action-icon green">
                <i className="bi bi-people-fill"></i>
              </div>

              <div>
                <strong>
                  View Employees
                </strong>

                <span>
                  Manage employee records
                </span>
              </div>

              <i className="bi bi-chevron-right"></i>

            </Link>

            {user?.role === "ADMIN" && (

              <Link
                to="/departments"
                className="quick-action"
              >

                <div className="quick-action-icon purple">
                  <i className="bi bi-building"></i>
                </div>

                <div>
                  <strong>
                    Manage Departments
                  </strong>

                  <span>
                    View and manage departments
                  </span>
                </div>

                <i className="bi bi-chevron-right"></i>

              </Link>

            )}

          </div>

          {/* SMALL SUMMARY */}

          <div className="quick-summary">

            <div className="quick-summary-icon">
              <i className="bi bi-shield-check"></i>
            </div>

            <div>
              <strong>
                System Status
              </strong>

              <span>
                Employee data is synchronized
              </span>
            </div>

            <span className="status-dot">
              Active
            </span>

          </div>

        </div>

      </div>

      {/* ========================================
          RECENT EMPLOYEES
      ======================================== */}

      <div className="dashboard-panel recent-panel">

        <div className="panel-header">

          <div>
            <h5>
              Recent Employees
            </h5>

            <span>
              Latest employee records
            </span>
          </div>

          <Link
            to="/employees"
            className="panel-link"
          >
            View All
            <i className="bi bi-arrow-right"></i>
          </Link>

        </div>

        <div className="recent-table-wrapper">

          <table className="table recent-table">

            <thead>
              <tr>

                <th>
                  Employee
                </th>

                <th>
                  Email
                </th>

                <th>
                  Designation
                </th>

                <th>
                  Department
                </th>

                <th>
                  Joining Date
                </th>

              </tr>
            </thead>

            <tbody>

              {recentEmployees.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="empty-table"
                  >
                    No employees found.
                  </td>
                </tr>

              ) : (

                recentEmployees.map((employee) => (

                  <tr key={employee.id}>

                    <td>

                      <div className="employee-info">

                        <div className="employee-avatar">

                          {employee.firstName
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {employee.firstName}{" "}
                            {employee.lastName}
                          </strong>

                          <span>
                            ID #{employee.id}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>
                      {employee.email}
                    </td>

                    <td>
                      {employee.designation || "-"}
                    </td>

                    <td>
                      <span
                        className={`department-badge department-${(
                          employee.department?.name || "unknown"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {employee.department?.name || "-"}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        employee.joiningDate
                      )}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}