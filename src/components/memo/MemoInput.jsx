import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './MemoInput.css';
import syncIcon from '../../assets/sync.png'; // 동기화 이미지 경로

const MemoInput = ({ date, currentMemo, onSave, showNotification }) => {
    const [title, setTitle] = useState(currentMemo.title);
    const [content, setContent] = useState(currentMemo.content);
    const [isSyncing, setIsSyncing] = useState(false); // 동기화 상태

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
        if (content.trim()) {
            setIsSyncing(true); // 동기화 시작
            try {
                await axiosInstance.post(`/api/memo/new`, {
                    title,
                    content,
                    date,
                });
                onSave({ title, content, date });
                showNotification("메모가 저장되었습니다");
            } catch (error) {
                console.error("Failed to auto-save memo:", error);
                alert("메모 저장에 실패했습니다.");
            } finally {
                setIsSyncing(false); // 동기화 종료
            }
        }
    };

    const handleManualSync = async () => {
        await handleAutoSave();
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
            <div className="sync-control">
                <img
                    src={syncIcon}
                    alt="동기화 아이콘"
                    className={`sync-icon ${isSyncing ? 'loading' : ''}`}
                    onClick={handleManualSync} // 클릭 시 수동 동기화
                />
            </div>
        </div>
    );
};

export default MemoInput;
