import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import NavBar from './components/common/NavBar';
import MemoApp from './components/MemoApp'; 
import AllMemos from './components/all-memos/AllMemos'; 
import MemoDetail from './components/memo-detail/MemoDetail'; 
import MyInfo from './components/my-info/MyInfo';
import Statistics from './components/statistics/Statistics'
import TopicList from './components/topic/TopicList'
import TopicContents from './components/topicContent/AllTopicContent'
import WriteTopicContents from './components/topicContent/WriteTopicContents';
import TopicContentDetail from './components/topicContent/TopicContentDetail';
import './styles.css'; // 전역 스타일

const ProtectedLayout = ({ children, theme, toggleTheme }) => (
    <ProtectedRoute element={<>{<NavBar theme={theme} toggleTheme={toggleTheme} />}{children}</>} />
);

function App() {
    const [theme, setTheme] = useState('light'); 

    // 컴포넌트가 마운트될 때 로컬스토리지에서 테마를 불러옵니다.
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
    }, []);

    // 테마 전환 함수
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // 새 테마를 로컬스토리지에 저장
    };

    return (
        <Router>
            <div className={theme}> {/* 테마 클래스 설정 */}
                <NavBar theme={theme} toggleTheme={toggleTheme} />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* 메인 페이지 (메모 및 달력) */}
                    <Route path="/" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><MemoApp /></ProtectedLayout>} />

                    {/* 모든 메모 보기 페이지 */}
                    <Route path="/all-memos" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><AllMemos /></ProtectedLayout>} />
                    {/* 메모 상세보기 페이지 */}
                    <Route path="/memo/:date" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><MemoDetail /></ProtectedLayout>} />


                    {/* 주제 리스트 */}
                    <Route path="/topic-list" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><TopicList /></ProtectedLayout>} />
                    {/* 모든 주제별 포스팅 */}
                    <Route path="/topic/:topicId" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><TopicContents /></ProtectedLayout>} />                
                    {/* 새로운 포스팅 */}
                    <Route path="/topic/write" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><WriteTopicContents /></ProtectedLayout>} />
                    {/* 포스팅 디테일 */}
                    <Route path="/topicContents/:topicContentsId" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><TopicContentDetail /></ProtectedLayout>} />
                    
                    {/* 메모 분석 페이지 */}
                    <Route path="/statistics" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><Statistics /></ProtectedLayout>} />
                    
                    {/* 마이 페이지 */}
                    <Route path="/my-info" element={<ProtectedLayout theme={theme} toggleTheme={toggleTheme}><MyInfo /></ProtectedLayout>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
