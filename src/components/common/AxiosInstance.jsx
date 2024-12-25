import axios from 'axios';

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
        console.error('요청 설정 중 에러:', error);
        return Promise.reject(error);
    }
);

// 응답 처리 - 401(Unauthorized)일 때 자동으로 refresh token을 사용해 토큰 재발급
axiosInstance.interceptors.response.use(
    (response) => response, // 성공한 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 401 에러 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지
            
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // 토큰 재발급 요청
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/api/auth/refresh`,
                        { refreshToken }
                    );

                    const newAccessToken = response.data.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // 실패했던 요청에 새로운 토큰 추가 후 재시도
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('토큰 재발급 실패:', refreshError);
                    handleLogout();
                }
            } else {
                handleLogout();
            }
        }

        // 기타 에러 처리
        if (!error.response) {
            console.error('서버와 연결할 수 없습니다:', error);
            alert('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
        } else {
            const status = error.response.status;
            const message = error.response.data?.message || '오류가 발생했습니다.';

            if (status === 403) {
                alert('권한이 없습니다.');
            } else if (status === 500) {
                alert('서버 내부 오류가 발생했습니다.');
            } else {
                alert(`에러(${status}): ${message}`);
            }
        }

        return Promise.reject(error);
    }
);

// 로그아웃 및 리다이렉트 함수
function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    window.location.href = '/login';
}

export default axiosInstance;
