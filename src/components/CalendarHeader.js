import React from 'react';

function CalendarHeader({ month, year, onPreviousMonth, onNextMonth }) {
    return (
        <div className="calendar-header">
            <button onClick={onPreviousMonth} className="arrow-button">&lt;</button>
            <h2>{year} {month}</h2>
            <button onClick={onNextMonth} className="arrow-button">&gt;</button>
        </div>
    );
}

export default CalendarHeader;
