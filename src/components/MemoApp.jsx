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

    // 자정 새로 고침
    useEffect(() => {
        const checkForMidnightRefresh = () => {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setDate(now.getDate() + 1);
            nextMidnight.setHours(0, 0, 0, 0); // 다음 자정으로 설정

            const timeUntilMidnight = nextMidnight - now;

            setTimeout(() => {
                window.location.reload();
            }, timeUntilMidnight);
        };

        checkForMidnightRefresh();
    }, []);

    // 마지막 활동 확인 후 새로 고침
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const lastActivity = localStorage.getItem('lastActivity');
            const timeoutDuration = 30 * 60 * 1000; // 30분

            if (lastActivity && (now - new Date(lastActivity) > timeoutDuration)) {
                window.location.reload();
            }
        }, 1000 * 60); // 매 분마다 확인

        return () => clearInterval(intervalId);
    }, []);

    // 마지막 활동 시간 업데이트
    useEffect(() => {
        const updateLastActivity = () => {
            localStorage.setItem('lastActivity', new Date().toISOString());
        };

        window.addEventListener('mousemove', updateLastActivity);
        window.addEventListener('keypress', updateLastActivity);

        return () => {
            window.removeEventListener('mousemove', updateLastActivity);
            window.removeEventListener('keypress', updateLastActivity);
        };
    }, []);

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
