import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './MemoInput.css';

const MemoInput = ({ date, currentMemo, showNotification }) => {
    const [title, setTitle] = useState(currentMemo.title);
    const [content, setContent] = useState(currentMemo.content);

    useEffect(() => {
        setTitle(currentMemo.title || date); 
        setContent(currentMemo.content);
    }, [currentMemo, date]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleAutoSave();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title, content]);

    const handleAutoSave = async () => {
        try {
            await axiosInstance.post(`/api/memo/new`, {
                title,
                content,
                date,
            });
            showNotification("일일메모가 저장되었습니다"); 
        } catch (error) {
            console.error("Failed to auto-save memo:", error);
        }
    };

    return (
        <div className="memo-input-container">
            <form className="memo-input-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="여기에 적어놔라..."
                    required
                />
            </form>
        </div>
    );
};

export default MemoInput;
