import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import NavBar from './components/common/NavBar';
import MemoApp from './components/MemoApp'; // 메모와 달력을 포함하는 컴포넌트

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <NavBar />
                                    <MemoApp /> {/* 메모와 달력을 포함하는 컴포넌트 */}
                                </>
                            }
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
