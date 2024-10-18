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
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const fetchMemosByMonth = async (formattedMonth) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/memo/memos/${formattedMonth}`);
            setMemos(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch memos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch memos for the initial selected month
    useEffect(() => {
        fetchMemosByMonth(selectedDate.slice(0, 7)); // YYYY-MM 형식으로 전달
    }, []); // Empty dependency array to run only on mount

    // Use effect to set the current memo whenever the selected date changes
    useEffect(() => {
        const memoForSelectedDate = memos.find(memo => memo.date === selectedDate);
        setCurrentMemo(memoForSelectedDate || { title: '', content: '' });
    }, [selectedDate, memos]);

    // Handle month change from Calendar
    const handleMonthChange = (newMonth, newYear) => {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        const formattedMonth = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
        fetchMemosByMonth(formattedMonth); // Fetch memos for the new month
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 2000); // 2초 후에 알림 제거
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
                <Calendar
                    memos={memos}
                    onDateClick={setSelectedDate}
                    onMonthChange={handleMonthChange}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                />
            </div>
            <div className="user-note-section">
                <UserNote showNotification={showNotification} />
                {notification && (
                    <div className={`saved-notification show`}>
                        {notification}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoApp;
