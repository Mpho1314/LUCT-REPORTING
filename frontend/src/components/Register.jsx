import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import "../styles/Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "student", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Send register request
      await authService.register({
        username: formData.username,
        password: formData.password,
        full_name: formData.fullName,
        role: formData.role,
      });

      // Auto-login after successful registration
      await authService.login({
        username: formData.username,
        password: formData.password,
      });

      // Redirect based on role
      switch (formData.role.toLowerCase()) {
        case "lecturer":
          navigate("/lecturer");
          break;
        case "prl":
          navigate("/prl");
          break;
        case "pl":
          navigate("/pl");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="prl">PRL</option>
              <option value="pl">PL</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
