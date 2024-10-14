import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import Loading from '../loading/Loading'; 
import './UserNote.css';

const UserNote = () => {
    const [userNote, setUserNote] = useState({ content: '' });
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        fetchUserNote();
    }, []);

    const fetchUserNote = async () => {
        setLoading(true); 
        try {
            const response = await axiosInstance.get(`/api/memo/user_note`);
            if (response.data && response.data.data.content) {
                // 응답 데이터의 유효성 확인 후 상태 업데이트
                setUserNote({ content: response.data.data.content });
            } else {
                // 예상과 다른 응답일 경우 기본값 설정
                setUserNote({ content: '여기에 적어놔라...' });
            }
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
            // 에러 발생 시 기본 노트 내용 설정
            setUserNote({ content: 'Error fetching note. Please try again.' });
        } finally {
            setLoading(false); 
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
            window.location.reload();
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
            alert("노트를 저장하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <div>
            {loading && <Loading />} {/* 로딩 화면 표시 */}
            <form onSubmit={handleNoteSubmit}>
                <textarea
                    name="content"
                    value={userNote.content}
                    onChange={handleNoteChange}
                    placeholder="여기에 적어놔라..."
                    className="note-content"
                />
                <button type="submit" className="save-button">Save Note</button>
            </form>
        </div>
    );
};

export default UserNote;
