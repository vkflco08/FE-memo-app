import React, { useState, useEffect } from 'react';
import './MemoInput.css';

function MemoInput({ saveMemo }) {
    const today = new Date().toISOString().slice(0, 10);
    const [title, setTitle] = useState(`${today}`);
    const [content, setContent] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedMemo = JSON.parse(localStorage.getItem('memos')) || {};
        if (savedMemo[today]) {
            setTitle(today);
            setContent(savedMemo[today].content);
            setIsSaved(true);
        }
    }, [today]);

    const handleSave = () => {
        saveMemo(today, { title, content });
        setIsSaved(true);
    };

    return (
        <div className="memo-input-container">
            <div className="memo-input-header">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    readOnly 
                    className="memo-input-title"
                />
            </div>
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Write your memo here..."
                className="memo-input-content"
            ></textarea>
            {!isSaved && (
                <div className="memo-input-actions">
                    <button onClick={handleSave} className="memo-input-save-button">Save</button>
                </div>
            )}
        </div>
    );
}

export default MemoInput;
