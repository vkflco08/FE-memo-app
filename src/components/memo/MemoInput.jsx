import React, { useState, useEffect } from 'react';
import './MemoInput.css';
import axiosInstance from '../common/AxiosInstance';

const MemoInput = ({ date, currentMemo, setCurrentMemo }) => {
    const [title, setTitle] = useState(currentMemo.title);
    const [content, setContent] = useState(currentMemo.content);

    useEffect(() => {
        setTitle(currentMemo.title || date); // Default to date
        setContent(currentMemo.content);
    }, [currentMemo, date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/memo/new`, {
                title: title,
                content: content,
                date: date,
            });

            if (response.status === 200) { // Check if the response is OK
                //fetchMemos(); // Fetch updated memos after submission
                setCurrentMemo({ title: '', content: '' }); // Reset current memo
                window.location.reload()
            } else {
                console.error("Failed to submit memo:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to submit memo:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="memo-input-form">
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
                placeholder="내용"
                required
            />
            <button type="submit">저장</button>
        </form>
    );
};

export default MemoInput;
