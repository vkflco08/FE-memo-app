import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ theme, toggleTheme }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 사이드바 열기/닫기 토글 함수
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">ㅈㅇㄴㄹ</Link>
          <div className="navbar-menu">
            <button className="theme-toggle-button" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {/* 서랍 아이콘 추가 */}
            <button className="sidebar-toggle-button" onClick={toggleSidebar}>☰</button>
          </div>
        </div>
      </nav>

      {/* 사이드바 */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar-button" onClick={toggleSidebar}>x</button>
        <div className="sidebar-content">
          {isAuthenticated ? (
            <>
              <Link to="/all-memos" className="sidebar-link" onClick={toggleSidebar}>모든 메모 보기</Link>
              <hr className="sidebar-divider" /> {/* 가로선 추가 */}
              <Link to="/my-info" className="sidebar-link" onClick={toggleSidebar}>내 정보 보기</Link>
              <Link to="/statistics" className="sidebar-link" onClick={toggleSidebar}>통계 보기</Link>
              <hr className="sidebar-divider" /> {/* 가로선 추가 */}
              <Link to="/" className="sidebar-link" onClick={logout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="sidebar-link" onClick={toggleSidebar}>Login</Link>
              <Link to="/signup" className="sidebar-link" onClick={toggleSidebar}>Sign Up</Link>
              <hr className="sidebar-divider" /> {/* 가로선 추가 */}
              <p className="sidebar-note">로그인 후 이용 가능합니다.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
