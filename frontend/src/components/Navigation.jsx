import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Clear invalid user
    if (!user || !user.token || !user.role) {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserRole('');
    } else {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          LUCT Reporting System
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/about" className="navbar-item">About</Link>
          <Link to="/faculties" className="navbar-item">Faculties</Link>
          <Link to="/contact" className="navbar-item">Contact</Link>
          <Link to="/admissions" className="navbar-item">Admissions</Link>
          <Link to="/news" className="navbar-item">News</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="navbar-item">Login</Link>
              <Link to="/register" className="navbar-button">Register</Link>
            </>
          ) : (
            <>
              {/* Role-based links */}
              {(userRole === 'lecturer' || userRole === 'prl' || userRole === 'pl') && (
                <Link to="/reports" className="navbar-item">Reports</Link>
              )}
              {(userRole === 'prl' || userRole === 'pl') && (
                <Link to="/courses" className="navbar-item">Courses</Link>
              )}
              {(userRole === 'pl') && (
                <>
                  <Link to="/lectures" className="navbar-item">Lectures</Link>
                  <Link to="/monitoring" className="navbar-item">Monitoring</Link>
                  <Link to="/classes" className="navbar-item">Classes</Link>
                  <Link to="/rating" className="navbar-item">Rating</Link>
                </>
              )}
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
