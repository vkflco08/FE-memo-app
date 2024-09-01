import React, { useState, useEffect } from 'react';

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
        <div className="memo-input">
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                readOnly 
            />
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Write your memo here..."
            ></textarea>
            {!isSaved && <button onClick={handleSave}>완료하기</button>}
        </div>
    );
}

export default MemoInput;
