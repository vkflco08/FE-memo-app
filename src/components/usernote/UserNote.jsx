import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../common/AxiosInstance';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './UserNote.css';

const UserNote = ({ showNotification }) => {
    const [userNote, setUserNote] = useState({ content: '' });
    const quillRef = useRef(null);

    useEffect(() => {
        quillRef.current = new Quill('#editor', {
            theme: 'snow',
            placeholder: '여기에 적어놔라...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean'],
                ]
            }
        });

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
                quillRef.current.root.innerHTML = response.data.data.content;
            }
        } catch (error) {
            alert(error.response?.data?.message || "유저노트를 가져오는데 실패했습니다.");
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
            alert(error.response?.data?.message || "유저노트 저장에 실패했습니다.");
        }
    };

    return (
        <div>
            <div id="editor" className="note-content"></div>
        </div>
    );
};

export default UserNote;
