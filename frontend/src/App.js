import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import LecturerDashboard from "./components/LecturerDashboard";
import PRLDashboard from "./components/PRLDashboard";
import PLDashboard from "./components/PLDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import FacultiesPage from "./components/FacultiesPage";
import AdmissionPage from "./components/AdmissionPage";
import NewsPage from "./components/NewsPage";
import './App.css';

// ✅ Footer component
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Reporting_system </p>
        <p className="footer-tagline">Empowering Innovation • Creativity • Excellence</p>
      </div>
    </footer>
  );
}

// Simple error boundary component
function ErrorFallback() {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>There was an error loading this page. Please try refreshing.</p>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  );
}

// Layout wrapper to conditionally render Navigation & Footer
function Layout({ children }) {
  const location = useLocation();

  const publicRoutes = [
    "/", "/about", "/contact", "/faculties", 
    "/admissions", "/news", "/register", "/login"
  ];

  return (
    <div className="app-container">
      {publicRoutes.includes(location.pathname) && <Navigation />}
      <div className="content-container">{children}</div>
      {publicRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

// ✅ Wrapper for dashboards with logout
function DashboardRoutes() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // or sessionStorage depending on your login
    navigate("/login");
  };

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faculties" element={<FacultiesPage />} />
      <Route path="/admissions" element={<AdmissionPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboards */}
      <Route
        path="/lecturer"
        element={
          <ErrorBoundary>
            <LecturerDashboard onLogout={handleLogout} />
          </ErrorBoundary>
        }
      />
      <Route
        path="/prl"
        element={
          <ErrorBoundary>
            <PRLDashboard onLogout={handleLogout} />
          </ErrorBoundary>
        }
      />
      <Route
        path="/pl"
        element={
          <ErrorBoundary>
            <PLDashboard onLogout={handleLogout} />
          </ErrorBoundary>
        }
      />
      <Route
        path="/student"
        element={<StudentDashboard onLogout={handleLogout} />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <DashboardRoutes />
      </Layout>
    </BrowserRouter>
  );
}

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

export default App;
