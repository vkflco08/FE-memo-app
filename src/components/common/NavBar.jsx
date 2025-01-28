import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../common/AxiosInstance';
import './NavBar.css';
import { FaUserCircle } from 'react-icons/fa'; // 기본 아이콘으로 사용자 아이콘 사용

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  // 사이드바 열기/닫기 토글 함수
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 프로필 이미지 가져오기
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/member/info');
      const profileImage = response.data.data.profileImage;
      console.log(profileImage)
      if (profileImage) {
        const relativePath = profileImage.split('uploads')[1];
        setProfileImage(`${process.env.REACT_APP_API_BASE_URL}/uploads${relativePath}`);
      } else {
        setProfileImage('');
      }
    } catch (error) {
      console.error(error);
      alert('내 정보를 불러오는데 실패했습니다.');
    }
  };  

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile(); // 사용자 인증되었을 때만 프로필 로드
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // sidebar가 열려 있고 클릭한 곳이 sidebar와 sidebar-toggle-button이 아닌 경우
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle-button')) {
        setSidebarOpen(false);
      }
    };

    // 마운트 시 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">ㅈㅇㄴㄹ</Link>
          <div className="navbar-menu">
            <Link to="/topic/write" className="theme-button">글 작성</Link>
            {isAuthenticated ? (
              profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-picture"
                  onClick={toggleSidebar}
                />
              ) : (
                <FaUserCircle
                  className="profile-icon"
                  onClick={toggleSidebar}
                />
              )
            ) : null}
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
              <hr className="sidebar-divider" />
              <Link to="/topic-list" className="sidebar-link" onClick={toggleSidebar}>주제별 기록</Link>
              <hr className="sidebar-divider" />
              <Link to="/my-info" className="sidebar-link" onClick={toggleSidebar}>내 정보 보기</Link>
              <Link to="/statistics" className="sidebar-link" onClick={toggleSidebar}>통계 보기</Link>
              <hr className="sidebar-divider" />
              <Link to="/" className="sidebar-link" onClick={logout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="sidebar-link" onClick={toggleSidebar}>Login</Link>
              <Link to="/signup" className="sidebar-link" onClick={toggleSidebar}>Sign Up</Link>
              <hr className="sidebar-divider" />
              <p className="sidebar-note">로그인 후 이용 가능합니다.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
