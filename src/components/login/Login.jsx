import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../../contexts/AuthContext';
import axiosInstance from '../common/AxiosInstance';
import './login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    try {
      const response = await axiosInstance.post(`/api/member/login`, {
        loginId: username,
        password: password,
      });

      if (response.data.resultCode === 'SUCCESS') {
        const { accessToken, refreshToken } = response.data.data;
        
        // 로그인 성공 시 토큰 저장
        login(accessToken, refreshToken);

        // 홈 페이지로 이동
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      logout();
      alert('로그인 실패. 다시 시도해주세요.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>적어놔라</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            className="auth-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            className="auth-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login_button">Login</button>
        <div className="form-link">
          <span onClick={handleSignUpRedirect}>Don't have an account? Sign Up</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
