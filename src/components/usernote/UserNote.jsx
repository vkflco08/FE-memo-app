import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './UserNote.css';

const UserNote = ({ showNotification }) => {
    const [userNote, setUserNote] = useState({ content: '' });

    useEffect(() => {
        fetchUserNote();
    }, []);

    const fetchUserNote = async () => {
        try {
            const response = await axiosInstance.get(`/api/memo/user_note`);
            if (response.data && response.data.data.content) {
                setUserNote({ content: response.data.data.content });
            }
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleAutoSave();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [userNote.content]);

    const handleAutoSave = async () => {
        try {
            await axiosInstance.post(`/api/memo/user_note`, {
                content: userNote.content
            });
            showNotification("노트가 저장되었습니다");
        } catch (error) {
            console.error("Failed to auto-save note:", error);
        }
    };

    return (
        <div>
            <form>
                <textarea
                    name="content"
                    value={userNote.content}
                    onChange={(e) => setUserNote({ content: e.target.value })}
                    placeholder="여기에 적어놔라..."
                    className="note-content"
                />
            </form>
        </div>
    );
};

export default UserNote;
