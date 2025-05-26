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
            // console.log(response.data)
            setMemos(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch memos:", error);
            alert(error.response?.data?.message || "메모를 가져오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

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
            const memoIndex = prevMemos.findIndex((memo) => memo.date === newMemo.date);

            if (memoIndex !== -1) {
                const updatedMemos = [...prevMemos];
                updatedMemos[memoIndex] = newMemo;
                return updatedMemos;
            } else {
                return [...prevMemos, newMemo];
            }
        });
        setCurrentMemo(newMemo);
    };

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
            <UserNote showNotification={showNotification} />
            {notification && (
                <div className={`saved-notification show`}>
                    {notification}
                </div>
            )}
        </div>
    );
};

export default MemoApp;
