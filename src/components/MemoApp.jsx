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
            alert("메모를 가져오는데 실패했습니다.", error);
        } finally {
            // window.location.reload()
            setLoading(false);
        }
    };

    // Fetch memos for the initial selected month
    useEffect(() => {
        fetchMemosByMonth(selectedDate.slice(0, 7));
    }, []);

    useEffect(() => {
        const memoForSelectedDate = memos.find(memo => memo.date === selectedDate);
        setCurrentMemo(memoForSelectedDate || { title: '', content: '' });
    }, [selectedDate, memos]);

    const handleMonthChange = (newMonth, newYear) => {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        const formattedMonth = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
        fetchMemosByMonth(formattedMonth);
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 2000);
    };

    const handleSaveMemo = (newMemo) => {
        setMemos((prevMemos) => {
            // 새 메모의 날짜와 같은 날짜의 메모가 이미 존재하는지 확인
            const memoIndex = prevMemos.findIndex((memo) => memo.date === newMemo.date);

            if (memoIndex !== -1) {
                // 기존 메모가 있는 경우, 해당 메모를 업데이트
                const updatedMemos = [...prevMemos];
                updatedMemos[memoIndex] = newMemo;
                return updatedMemos;
            } else {
                // 기존 메모가 없는 경우, 새로운 메모를 추가
                return [...prevMemos, newMemo];
            }
        });
        setCurrentMemo(newMemo);
    };

    useEffect(() => {
        const checkForMidnightRefresh = () => {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setDate(now.getDate() + 1);
            nextMidnight.setHours(0, 0, 0, 0);
            const timeUntilMidnight = nextMidnight - now;

            setTimeout(() => {
                window.location.reload();
            }, timeUntilMidnight);
        };

        checkForMidnightRefresh();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const lastActivity = localStorage.getItem('lastActivity');
            const timeoutDuration = 30 * 60 * 1000;

            if (lastActivity && (now - new Date(lastActivity) > timeoutDuration)) {
                window.location.reload();
            }
        }, 1000 * 60);

        return () => clearInterval(intervalId);
    }, []);

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
                    onSave={handleSaveMemo}
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
