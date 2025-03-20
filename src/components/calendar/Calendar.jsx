import React, { useState, useMemo } from 'react';
import './Calendar.css';

const Calendar = ({ memos, onDateClick, onMonthChange, currentMonth, currentYear }) => {
    const UTCtoday = new Date();
    UTCtoday.setHours(UTCtoday.getHours() + 9);
    const today = UTCtoday.toISOString().split('T')[0];

    // Functions to calculate days
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const getLastDayOfMonth = (year, month) => new Date(year, month + 1, 0).getDay();

    // Change month functions
    const handlePrevMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        onMonthChange(newMonth, newYear);
    };

    const handleNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        onMonthChange(newMonth, newYear);
    };

    // Date formatting
    const formatKSTDate = (year, month, day) => {
        const date = new Date(year, month, day);
        date.setHours(date.getHours() + 9);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // Calculate the number of days in the month and the first and last days of the month
    const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const firstDayOfMonth = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const lastDayOfMonth = useMemo(() => getLastDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

    // Create an array of dates for the calendar
    const dates = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => {
        const date = formatKSTDate(currentYear, currentMonth, i + 1);
        return { date, hasMemo: memos.some(memo => memo.date === date) };
    }), [currentYear, currentMonth, daysInMonth, memos]);

    const emptyDaysBefore = useMemo(() => Array.from({ length: firstDayOfMonth }, () => null), [firstDayOfMonth]);
    const emptyDaysAfter = useMemo(() => Array.from({ length: 6 - lastDayOfMonth }, () => null), [lastDayOfMonth]);

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button className="arrow-button" onClick={handlePrevMonth}>&lt;</button>
                <h2 className="calendar-title">{`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}</h2>
                <button className="arrow-button" onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="day-names">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="day-name">{day}</div>
                ))}
            </div>
            <div className="calendar-days">
                
                {[...emptyDaysBefore, ...dates, ...emptyDaysAfter].map((day, index) => {
                    if (!day) {
                        return <div key={index} className="calendar-day empty"></div>;
                    }
                    const { date, hasMemo } = day;
                    return (
                        <div
                            key={date}
                            className={`calendar-day ${hasMemo ? 'has-memo' : ''} ${date === today ? 'today' : ''}`}
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
