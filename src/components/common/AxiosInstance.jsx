import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 전에 access token을 항상 헤더에 포함
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 처리 - 401(Unauthorized)일 때 자동으로 refresh token을 사용해 토큰 재발급
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러가 발생하면
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // 무한 루프 방지용 플래그
            
            // refresh token 가져오기
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/refresh`, {
                        refreshToken: refreshToken,
                    });

                    // 새로운 access token을 로컬스토리지에 저장
                    const newAccessToken = response.data.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // 새로운 access token을 헤더에 설정한 후, 실패한 요청 재시도
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error("토큰 재발급 실패:", err);
                    // 만약 refresh token도 만료되었으면 로그인 페이지로 리다이렉트
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                // refresh token이 없으면 로그인 페이지로 리다이렉트
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
