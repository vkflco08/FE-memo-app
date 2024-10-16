import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ memos, onDateClick }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD 형식)

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // 현재 월의 일수와 1일의 요일을 계산
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // 요일을 월요일 기준으로 맞추기 위한 계산
    const adjustedFirstDay = (firstDayOfMonth + 6) % 7; // 일요일을 6으로, 월요일을 0으로

    // 해당 월의 날짜 리스트 생성
    const dates = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1).toISOString().split('T')[0];
        return { date, hasMemo: memos.some(memo => memo.date === date) };
    });

    // 달력 그리드의 첫 주에 빈 칸을 추가
    const emptyDays = Array.from({ length: adjustedFirstDay }, () => null);

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-days">
                <div className="day-names">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="day-name">{day}</div>
                    ))}
                </div>
                {[...emptyDays, ...dates].map((day, index) => {
                    if (!day) {
                        return <div key={index} className="calendar-day empty"></div>; // 빈 칸 처리
                    }
                    const { date, hasMemo } = day;
                    return (
                        <div
                            key={date}
                            className={`calendar-day ${hasMemo ? 'has-memo' : ''} ${date === today ? 'today' : ''}`}
                            data-date={new Date(date).getDate()}
                            onClick={() => onDateClick(date)}
                        >
                            {new Date(date).getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
