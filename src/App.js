import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Calendar from './components/calendar/Calendar';
import MemoInput from './components/memo/MemoInput';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import NavBar from './components/common/NavBar';

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
                    <MemoInput />
                    <Calendar />
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
