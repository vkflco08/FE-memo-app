import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './NavBar.css'; 

const NavBar = ({ theme, toggleTheme }) => {
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
          {/* 다크 모드 토글 버튼 */}
          <button className="theme-toggle-button" onClick={() => {
            console.log('Theme toggle button clicked'); // 이 로그가 출력되는지 확인
            toggleTheme(); 
          }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
