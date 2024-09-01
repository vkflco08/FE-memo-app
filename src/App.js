import React, { useState } from 'react';
import Calendar from './components/Calendar';
import { format } from 'date-fns';
import './styles.css';

function App() {
    const [memos, setMemos] = useState({});
    const [content, setContent] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const handleSave = () => {
        if (selectedDate) {
            const dateKey = format(selectedDate, 'yyyy-MM-dd');
            setMemos(prevMemos => ({
                ...prevMemos,
                [dateKey]: { title: format(selectedDate, 'yyyy.MM.dd'), content }
            }));
            setContent('');
            setSelectedDate(null);
        }
    };

    return (
        <div className="App">
            <h1>Memo App</h1>
            <div className="memo-form">
                <h2>{selectedDate ? `Memo for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a date to add a memo'}</h2>
                {selectedDate && (
                    <div className="memo-form-content">
                        <input
                            type="text"
                            value={format(selectedDate, 'yyyy.MM.dd')}
                            readOnly
                            className="memo-title"
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="memo-content"
                        />
                        <button className="save-button" onClick={handleSave}>Save Memo</button>
                    </div>
                )}
            </div>
            <Calendar memos={memos} onDateSelect={setSelectedDate} />
        </div>
    );
}

export default App;
