import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './UserNote.css';

const UserNote = () => {
    const [userNote, setUserNote] = useState({ content: '' });

    useEffect(() => {
        fetchUserNote();
    }, []);

    const fetchUserNote = async () => {
        try {
            const response = await axiosInstance.get(`/api/memo/user_note`);
            setUserNote(response.data); 
        } catch (error) {
            console.error("오류가 발생했습니다 :", error);
            setUserNote({ title: 'Default Note', content: 'Write your note here...' });
        }
    };

    const handleNoteChange = (e) => {
        const { name, value } = e.target;
        setUserNote((prevNote) => ({ ...prevNote, [name]: value }));
    };

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/api/memo/user_note`, {
                content: userNote.content
            });
            alert("정상적으로 저장되었습니다.");
        } catch (error) {
            console.error("오류가 발생했습니다 :", error);
        }
    };

    return (
            <form onSubmit={handleNoteSubmit}>
                <textarea
                    name="content"
                    value={userNote.content}
                    onChange={handleNoteChange}
                    placeholder="Write your note here..."
                    className="note-content"
                />
                <button type="submit" className="save-button">Save Note</button>
            </form>
    );
};

export default UserNote;
