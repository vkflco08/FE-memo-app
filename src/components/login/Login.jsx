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

  const handleLogin = async () => {
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
      logout()
      // console.error('로그인 오류:', error);
      alert('로그인 실패. 다시 시도해주세요.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="button" className="login_button" onClick={handleLogin}>Login</button>
        <div className="form-link">
          <span onClick={handleSignUpRedirect}>Don't have an account? Sign Up</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
