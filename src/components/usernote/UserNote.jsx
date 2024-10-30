import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../common/AxiosInstance';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './UserNote.css';

const UserNote = ({ showNotification }) => {
    const [userNote, setUserNote] = useState({ content: '' });
    const quillRef = useRef(null); // Quill 에디터 DOM 요소에 대한 ref

    useEffect(() => {
        // Quill 에디터 초기화
        quillRef.current = new Quill('#editor', {
            theme: 'snow',
            placeholder: '여기에 적어놔라...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean'] // 포맷팅 제거 버튼
                ]
            }
        });

        // Quill 에디터에서 내용이 변경될 때마다 상태 업데이트
        quillRef.current.on('text-change', () => {
            setUserNote({ content: quillRef.current.root.innerHTML });
        });

        fetchUserNote();
    }, []);

    const fetchUserNote = async () => {
        try {
            const response = await axiosInstance.get(`/api/memo/user_note`);
            if (response.data && response.data.data.content) {
                setUserNote({ content: response.data.data.content });
                quillRef.current.root.innerHTML = response.data.data.content; // Quill 에디터에 초기 내용 설정
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
            if (userNote.content.trim()) {
                await axiosInstance.post(`/api/memo/user_note`, {
                    content: userNote.content
                });
                showNotification("노트가 저장되었습니다");
            }
        } catch (error) {
            console.error("Failed to auto-save note:", error);
            alert("유저노트 저장에 실패했습니다.", error);
        }
    };

    return (
        <div>
            <div id="editor" className="note-content"></div>
        </div>
    );
};

export default UserNote;
