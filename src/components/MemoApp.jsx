import React, { useState, useEffect } from 'react';
import Calendar from './calendar/Calendar';
import MemoInput from './memo/MemoInput';
import UserNote from './usernote/UserNote';
import axiosInstance from './common/AxiosInstance';
import './MemoApp.css';

const MemoApp = () => {
    const [memos, setMemos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentMemo, setCurrentMemo] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchMemos();
    }, []);

    const fetchMemos = async () => {
        try {
            const response = await axiosInstance.get(`/api/memo/all`);
            const memos = response.data.data;
            setMemos(Array.isArray(memos) ? memos : []); // Set memos
            setCurrentMemo(memos.find(memo => memo.date === selectedDate) || { title: selectedDate, content: '' }); // Set memo for today
        } catch (error) {
            console.error("Failed to fetch memos:", error);
            setMemos([]); // Error handling
        }
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const memo = memos.find(memo => memo.date === date);
        setCurrentMemo(memo || { title: date, content: '' }); // Update current memo based on selected date
    };

    const handleMemoSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/api/memo/new`, {
                title: currentMemo.title,
                content: currentMemo.content,
                date: selectedDate,
            });
            fetchMemos(); // Refresh memos after submission
            setCurrentMemo({ title: '', content: '' }); // Reset current memo
        } catch (error) {
            console.error("Failed to submit memo:", error);
        }
    };

    return (
        <div className="memo-app-container">
            <div className="memo-section">
                <MemoInput
                    date={selectedDate}
                    currentMemo={currentMemo}
                    setCurrentMemo={setCurrentMemo}
                    onMemoSubmit={handleMemoSubmit}
                    fetchMemos={fetchMemos}
                />
                <Calendar memos={memos} onDateClick={handleDateClick} />
            </div>
            <div className="user-note-section">
                <UserNote />
            </div>
        </div>
    );
};

export default MemoApp;
