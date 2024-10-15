import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import NavBar from './components/common/NavBar';
import MemoApp from './components/MemoApp'; 
import AllMemos from './components/all-memos/AllMemos'; 
import MemoDetail from './components/memo-detail/MemoDetail'; 

const ProtectedLayout = ({ children }) => (
    <ProtectedRoute element={<>{<NavBar />}{children}</>} />
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* 메인 페이지 (메모 및 달력) */}
                <Route path="/" element={<ProtectedLayout><MemoApp /></ProtectedLayout>} />

                {/* 모든 메모 보기 페이지 */}
                <Route path="/all-memos" element={<ProtectedLayout><AllMemos /></ProtectedLayout>} />

                {/* 메모 상세보기 페이지 */}
                <Route path="/memo/:date" element={<ProtectedLayout><MemoDetail /></ProtectedLayout>} />
            </Routes>
        </Router>
    );
}

export default App;
