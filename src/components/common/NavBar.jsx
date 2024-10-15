import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './NavBar.css'; 

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">ㅈㅇㄴㄹ</Link>
        <div className="navbar-menu">
          {isAuthenticated && (
            <Link to="/all-memos" className="memo-link">모든 메모 보기</Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/" className="auth-link" onClick={logout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
