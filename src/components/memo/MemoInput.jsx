import React, { useState, useEffect } from 'react';
import Loading from '../loading/Loading'; // Loading 컴포넌트를 불러옵니다.
import './MemoInput.css';
import axiosInstance from '../common/AxiosInstance';

const MemoInput = ({ date, currentMemo, setCurrentMemo }) => {
    const [title, setTitle] = useState(currentMemo.title);
    const [content, setContent] = useState(currentMemo.content);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    useEffect(() => {
        setTitle(currentMemo.title || date); // Default to date
        setContent(currentMemo.content);
    }, [currentMemo, date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 로딩 시작

        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/memo/new`, {
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
            setLoading(false); // 로딩 끝
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
                    placeholder="내용"
                    required
                />
                <button type="submit">저장</button>
            </form>
        </>
    );
};

export default MemoInput;
