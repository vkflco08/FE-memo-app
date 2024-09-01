import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDay from './CalendarDay';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';

function Calendar({ memos, onDateSelect }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([]);

    useEffect(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const startWeek = startOfWeek(start, { weekStartsOn: 0 }); // Week starts on Sunday
        const endWeek = endOfWeek(end, { weekStartsOn: 0 });
        const daysArray = eachDayOfInterval({ start: startWeek, end: endWeek });
        setDays(daysArray);
    }, [currentDate]);

    const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    return (
        <div className="calendar">
            <CalendarHeader
                month={format(currentDate, 'MMMM')}
                year={format(currentDate, 'yyyy')}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
            />
            <div className="calendar-days-of-week">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="calendar-day-of-week">{day}</div>
                ))}
            </div>
            <div className="calendar-days">
                {days.map(day => {
                    const dayString = format(day, 'yyyy-MM-dd');
                    return (
                        <CalendarDay
                            key={dayString}
                            day={format(day, 'd')}
                            isToday={isToday(day) && isSameDay(day, new Date())}
                            hasMemo={!!memos[dayString]}
                            onClick={() => onDateSelect(day)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
