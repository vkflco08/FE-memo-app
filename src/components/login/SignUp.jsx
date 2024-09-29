import axiosInstance from '../common/AxiosInstance';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 

function SignUp() {
    const [loginId, setloginId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post(`/api/member/signup`, {
                loginId,
                password,
                name,
                email
            });

            if (response.status === 200) {
                alert('회원가입 성공');
                navigate('/login');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data.data;
                const errorMessages = Object.values(errorData).join('\n');
                if (errorMessages) {
                    alert(errorMessages);
                } else {
                    alert('회원가입 실패');
                }
            } else {
                alert('회원가입 실패');
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="loginId">Login ID:</label>
                    <input
                        type="text"
                        id="loginId"
                        value={loginId}
                        onChange={(e) => setloginId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        required
                    />
                </div>
                <button className="register_button" type="submit">Sign Up</button>
                <div className="form-link">
                  <span onClick={handleLoginRedirect}>Already have an account? Login</span>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
