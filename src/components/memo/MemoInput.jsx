import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './MemoInput.css';
import syncIcon from '../../assets/sync.png';

const MemoInput = ({ date, currentMemo, onSave, showNotification }) => {
    const [title, setTitle] = useState(currentMemo.title);
    const [content, setContent] = useState(currentMemo.content);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTitle(currentMemo.title || date); 
        setContent(currentMemo.content);
    }, [currentMemo, date]);

    useEffect(() => {
        if (isEditing) {
            const timeoutId = setTimeout(() => {
                handleAutoSave();
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [title, content, isEditing]);

    useEffect(() => {
        const checkForMidnightRefresh = () => {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setDate(now.getDate() + 1);
            nextMidnight.setHours(0, 0, 0, 0);
            const timeUntilMidnight = nextMidnight - now;

            setTimeout(async () => {
                if (content.trim()) {
                    await handleAutoSave(); 
                }
                window.location.reload();
            }, timeUntilMidnight);
        };

        checkForMidnightRefresh();
    }, [content]);

    // 자동 저장 기능
    const handleAutoSave = async () => {
        if (content.trim()) {
            setIsSyncing(true);
            try {
                await axiosInstance.post(`/api/memo/new`, {
                    title,
                    content,
                    date,
                });
                onSave({ title, content, date });
                showNotification("메모가 저장되었습니다");
            } catch (error) {
                alert(error.response?.data?.message || "메모 저장에 실패했습니다.");
            } finally {
                setIsSyncing(false);
            }
        }
    };

    // 수동으로 동기화
    const handleManualSync = async () => {
        await handleAutoSave();
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <div className="memo-input-container">
            <div className="sync-control">
                <img
                    src={syncIcon}
                    alt="동기화 아이콘"
                    className={`sync-icon ${isSyncing ? 'loading' : ''}`}
                    onClick={handleManualSync}
                />
            </div>
            <input
                type="text"
                value={title}
                onChange={handleInputChange(setTitle)}
                onBlur={handleBlur}
                placeholder="제목"
                required
            />
            <textarea
                value={content}
                onChange={handleInputChange(setContent)}
                onBlur={handleBlur}
                placeholder="여기에 적어놔라..."
                required
            />
        </div>
    );
};

export default MemoInput;
