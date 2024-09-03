import React from 'react';

function CalendarDay({ day, isToday, hasMemo, onClick }) {
    return (
        <div
            className={`calendar-day ${isToday ? 'today' : ''} ${hasMemo ? 'has-memo' : ''}`}
            onClick={() => onClick(day)}
        >
            {day}
        </div>
    );
}

export default CalendarDay;
