import React, { useState, useMemo, useCallback } from 'react';
import './Calendar.css';

const Calendar = ({ memos, onDateClick }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const UTCtoday = new Date();
    UTCtoday.setHours(UTCtoday.getHours() + 9); 
    const today = UTCtoday.toISOString().split('T')[0]; 

    // 특정 연도와 월의 일수를 반환하는 함수
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // 해당 월의 첫 번째 날의 요일을 반환하는 함수
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // 해당 월의 마지막 날의 요일을 반환하는 함수
    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDay();
    };

    const handlePrevMonth = useCallback(() => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }, [currentMonth, currentYear]);

    const handleNextMonth = useCallback(() => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }, [currentMonth, currentYear]);

    // 서울 시간을 기준으로 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
    const formatKSTDate = (year, month, day) => {
        const date = new Date(year, month, day);
        date.setHours(date.getHours() + 9); // UTC+9 시간대 적용
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // 현재 월의 일수와 첫 번째 날 및 마지막 날의 요일을 계산
    const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const firstDayOfMonth = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const lastDayOfMonth = useMemo(() => getLastDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

    // 해당 월의 날짜 리스트 생성
    const dates = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => {
        const date = formatKSTDate(currentYear, currentMonth, i + 1); // 서울 시간 기준으로 YYYY-MM-DD 형식의 날짜 생성
        return { date, hasMemo: memos.some(memo => memo.date === date) };
    }), [currentYear, currentMonth, daysInMonth, memos]);

    // 달력의 빈 칸 처리 (해당 월의 1일이 시작하는 요일만큼 빈 칸을 추가)
    const emptyDaysBefore = useMemo(() => Array.from({ length: firstDayOfMonth }, () => null), [firstDayOfMonth]);

    // 해당 월이 끝나고 남은 빈 칸 처리 (토요일까지 빈 칸을 채움)
    const emptyDaysAfter = useMemo(() => Array.from({ length: 6 - lastDayOfMonth }, () => null), [lastDayOfMonth]);

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
                {/* 빈 칸과 날짜를 합쳐서 달력 출력 */}
                {[...emptyDaysBefore, ...dates, ...emptyDaysAfter].map((day, index) => {
                    if (!day) {
                        return <div key={index} className="calendar-day empty"></div>; // 빈 칸 처리
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
