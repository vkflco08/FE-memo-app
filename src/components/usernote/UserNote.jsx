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
            console.log(response.data.data.content);
            if (response.data && response.data.data.content) {
                // 응답 데이터의 유효성 확인 후 상태 업데이트
                setUserNote({ content: response.data.data.content });
            } else {
                // 예상과 다른 응답일 경우 기본값 설정
                setUserNote({ content: 'Write your note here...' });
            }
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
            // 에러 발생 시 기본 노트 내용 설정
            setUserNote({ content: 'Error fetching note. Please try again.' });
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
            console.error("오류가 발생했습니다:", error);
            alert("노트를 저장하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
