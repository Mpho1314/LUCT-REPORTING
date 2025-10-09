import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import "../styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authService.login({ username, password });
      const data = response.data;
      
      // Store user data in localStorage including id
      localStorage.setItem("user", JSON.stringify({
        id: data.id,           // <-- make sure backend returns this
        token: data.token,
        username: data.username,
        role: data.role
      }));
      
      // Redirect based on role
      switch(data.role.toLowerCase()){
        case "lecturer": navigate("/lecturer"); break;
        case "prl": navigate("/prl"); break;
        case "pl": navigate("/pl"); break;
        case "student": navigate("/student"); break;
        default: navigate("/");
      }
    } catch(err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              className="form-control" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary auth-button" 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
