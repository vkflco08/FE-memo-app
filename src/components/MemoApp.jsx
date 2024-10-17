import React, { useState, useEffect } from 'react';
import Calendar from './calendar/Calendar';
import MemoInput from './memo/MemoInput';
import UserNote from './usernote/UserNote';
import Loading from './loading/Loading'; 
import axiosInstance from './common/AxiosInstance';
import './MemoApp.css';

const MemoApp = () => {
    const UTCtoday = new Date();
    UTCtoday.setHours(UTCtoday.getHours() + 9); 
    const today = UTCtoday.toISOString().split('T')[0]; 

    const [memos, setMemos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(today);
    const [currentMemo, setCurrentMemo] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchMemos();
    }, []);

    useEffect(() => {
        const memoForSelectedDate = memos.find(memo => memo.date === selectedDate);
        setCurrentMemo(memoForSelectedDate || { title: '', content: '' });
    }, [selectedDate, memos]);

    const fetchMemos = async () => {
        setLoading(true); 
        try {
            const response = await axiosInstance.get(`/api/memo/all`);
            setMemos(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch memos:", error);
        } finally {
            setLoading(false); 
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 2000); // Clear notification after 2 seconds
    };

    return (
        <div className="memo-app-container">
            {loading && <Loading />}
            <div className="memo-section">
                <MemoInput
                    date={selectedDate}
                    currentMemo={currentMemo}
                    showNotification={showNotification} 
                />
                <Calendar memos={memos} onDateClick={setSelectedDate} />
            </div>
            <div className="user-note-section">
                <UserNote 
                    showNotification={showNotification} 
                />
                {notification && <div className="saved-notification">{notification}</div>}
            </div>
        </div>
    );
};

export default MemoApp;
