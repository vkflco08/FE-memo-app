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

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1).toISOString().split('T')[0];
        return { date, hasMemo: memos.some(memo => memo.date === date) };
    });

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-days">
                <div className="day-names">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="day-name">{day}</div>
                    ))}
                </div>
                {dates.map(({ date, hasMemo }) => (
                    <div
                        key={date}
                        className={`calendar-day ${hasMemo ? 'has-memo' : ''} ${date === today ? 'today' : ''}`} // 오늘 날짜 클래스 추가
                        data-date={new Date(date).getDate()} // data-date 속성 추가
                        onClick={() => onDateClick(date)}
                    >
                        {new Date(date).getDate()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
