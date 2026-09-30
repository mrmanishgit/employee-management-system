import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  designation: "",
  salary: "",
  joiningDate: "",
  departmentId: "",
};

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/departments")
      .then((response) => setDepartments(response.data))
      .catch(() => setError("Unable to load departments."));

    if (id) {
      api.get(`/employees/${id}`)
        .then(({ data }) => {
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            designation: data.designation || "",
            salary: data.salary ?? "",
            joiningDate: data.joiningDate || "",
            departmentId: data.department?.id || "",
          });
        })
        .catch(() => setError("Unable to load employee."));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      salary: Number(form.salary),
      department: form.departmentId
        ? { id: Number(form.departmentId) }
        : null,
    };

    delete payload.departmentId;

    try {
      if (id) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post("/employees", payload);
      }

      navigate("/employees");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save employee."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? "Edit Employee" : "Add Employee"}</h2>
        <Link to="/employees" className="btn btn-outline-secondary">
          Back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {[
                ["firstName", "First Name", "text"],
                ["lastName", "Last Name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["designation", "Designation", "text"],
                ["salary", "Salary", "number"],
                ["joiningDate", "Joining Date", "date"],
              ].map(([name, label, type]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    className="form-control"
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={[
                      "firstName",
                      "lastName",
                      "email",
                      "salary",
                    ].includes(name)}
                    min={type === "number" ? "0" : undefined}
                    step={type === "number" ? "0.01" : undefined}
                  />
                </div>
              ))}

              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Employee"}
              </button>

              <Link to="/employees" className="btn btn-light">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}