import React, { useState, useEffect } from 'react';
import Loading from '../loading/Loading'; 
import './MemoInput.css';
import axiosInstance from '../common/AxiosInstance';

const MemoInput = ({ date, currentMemo, setCurrentMemo }) => {
    const [title, setTitle] = useState(currentMemo.title);
    const [content, setContent] = useState(currentMemo.content);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        setTitle(currentMemo.title || date); // Default to date
        setContent(currentMemo.content);
    }, [currentMemo, date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            const response = await axiosInstance.post(`/api/memo/new`, {
                title: title,
                content: content,
                date: date,
            });

            if (response.status === 200) {
                setCurrentMemo({ title: '', content: '' }); // Reset current memo
                window.location.reload();
            } else {
                console.error("Failed to submit memo:", response.statusText);
            }
        } catch (error) {
            console.error("Failed to submit memo:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            {loading && <Loading />} {/* 로딩 화면 표시 */}
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
                    placeholder="여기에 적어놔라..."
                    required
                />
                <button type="submit">Save Memo</button>
            </form>
        </>
    );
};

export default MemoInput;
