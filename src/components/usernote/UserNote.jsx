import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../common/AxiosInstance';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './UserNote.css';

const UserNote = ({ showNotification }) => {
    const [userNotes, setUserNotes] = useState([]);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
    const [isEditingTitle, setIsEditingTitle] = useState(null);
    const [newNoteTitle, setNewNoteTitle] = useState('새 노트');
    const quillRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill('#editor', {
                theme: 'snow',
                placeholder: '여기에 적어놔라...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['code-block'],
                        ['link'],
                        ['clean']
                    ]
                }
            });
        }

        fetchUserNotes();
    }, []);

    useEffect(() => {
        const quill = quillRef.current;
        if (quill) {
            const handleTextChange = () => {
                if (userNotes.length > 0) {
                    setUserNotes(prevNotes => {
                        const updatedNotes = [...prevNotes];
                        updatedNotes[selectedNoteIndex] = {
                            ...updatedNotes[selectedNoteIndex],
                            content: quill.root.innerHTML,
                        };
                        return updatedNotes;
                    });
                }
            };

            quill.on('text-change', handleTextChange);

            return () => {
                quill.off('text-change', handleTextChange);
            };
        }
    }, [selectedNoteIndex, userNotes]);

    const fetchUserNotes = async () => {
        try {
            const response = await axiosInstance.get(`/api/user_note/`);
            if (response.data && response.data.data) {
                const notes = response.data.data.map(note => ({
                    id: note.id,
                    title: note.title || '새 노트',
                    content: note.content || '',
                }));
                setUserNotes(notes);
                // console.log(response.data.data)
                // console.log(response.data.data[0].content)
                quillRef.current.root.innerHTML = response.data.data[0].content;
            }
        } catch (error) {
            alert(error.response?.data?.message || "유저노트를 가져오는데 실패했습니다.");
        }
    };

    // quill 에디터에 content 설정
    const loadNoteContent = (note) => {
        // console.log(note)
        if (quillRef.current && note.content !== undefined) {
            quillRef.current.root.innerHTML = note.content;
        }
    };

    const handleNoteSelect = async (index) => {
        setSelectedNoteIndex(index);
        const selectedNote = userNotes[index];
        loadNoteContent(selectedNote);
        setIsEditingTitle(null); // 제목 수정 상태 초기화
    };

    const handleAddNote = () => {
        if (userNotes.length >= 5) {
            alert("노트는 최대 5개까지만 추가할 수 있습니다.");
            return; // 5개 이상일 경우, 더 이상 노트를 추가하지 않음
        }
        setIsEditingTitle(-1); // 새 노트 추가 상태로 설정
        setNewNoteTitle('새 노트');
    };

    const handleNoteChange = (e) => {
        setNewNoteTitle(e.target.value);
    };

    /**
     * 새 노트 만들기
     */

    const handleSaveNewNote = async () => {
        if (!newNoteTitle.trim()) {
            alert("책갈피 제목을 입력하세요.");
            return;
        }

        if (userNotes.length >= 5) {
            alert("책갈피는 최대 5개까지만 추가할 수 있습니다.");
            return; // 5개 이상일 경우, 더 이상 노트를 저장하지 않음
        }

        try {
            setIsEditingTitle(null);
            
            await axiosInstance.post('/api/user_note/new', {
                title: newNoteTitle,
                content: '',
            });

            await fetchUserNotes();
            setSelectedNoteIndex(userNotes.length); // 새 노트를 선택
            quillRef.current.root.innerHTML = ""; // 새 노트의 내용을 비우기
         
            showNotification("새 노트가 추가되었습니다.");
        } catch (error) {
            alert(error.response?.data?.message || "새 노트를 추가하는 데 실패했습니다.");
        }
    };

    /**
     * 제목 변경 기능
     */

    const handleDoubleClickTitle = (index) => {
        setIsEditingTitle(index); // 클릭한 노트의 인덱스를 설정
        setNewNoteTitle(userNotes[index]?.title || "새 노트");
    };
    
    const handleTitleChange = (e) => {
        setNewNoteTitle(e.target.value);
    };
    
    const handleTitleSave = async () => {
        if (isEditingTitle === -1) return; // 새 노트 추가 상태에서 제목 변경 저장 안 함

        if (!newNoteTitle.trim()) {
            return;
        }

        const updatedNotes = [...userNotes];
        updatedNotes[isEditingTitle] = {
            ...updatedNotes[isEditingTitle],
            title: newNoteTitle,
        };

        setUserNotes(updatedNotes);
        setIsEditingTitle(null);

        try {
            await axiosInstance.post(`/api/user_note/new`, {
                id: updatedNotes[isEditingTitle].id,
                title: newNoteTitle,
                content: updatedNotes[isEditingTitle].content,
            });

            showNotification("제목이 변경되었습니다.");
        } catch (error) {
            alert(error.response?.data?.message || "제목 변경에 실패했습니다.");
        }
    };

    /**
     * 노트 삭제 기능 
     */

    const handleDeleteNote = async (index, e) => {
        e.preventDefault(); // 삭제 시 onBlur가 발생하지 않도록 막음

        if (userNotes.length == 1) {
            alert("최소 하나의 노트는 존재해야 합니다.");
            return; // 1개인 경우, 노트는 삭제 불가능
        }

        const confirmDelete = window.confirm("정말로 이 노트를 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                const noteToDelete = userNotes[index];
                const response = await axiosInstance.delete(`/api/user_note/${noteToDelete.id}`); // DELETE API 호출

                if (response.data && response.data.data) {
                    const notes = response.data.data.map(note => ({
                        id: note.id,
                        title: note.title || '새 노트',
                        content: note.content || '',
                    }));
                    setUserNotes(notes);    // 상태 업데이트
                    
                    // 마지막 노트를 선택하는 작업을 상태 업데이트 후에 처리
                    setTimeout(() => {
                        if (notes.length > 0) {
                            handleNoteSelect(index - 1); // 마지막 노트를 선택
                        }
                    }, 0);
                }
                showNotification("노트가 삭제되었습니다.");
            } catch (error) {
                alert(error.response?.data?.message || "노트 삭제에 실패했습니다.");
            }
        }
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            handleAutoSave();
        }, 1000);

        // console.log(selectedNoteIndex)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [selectedNoteIndex, userNotes[selectedNoteIndex]?.content]);
    
    const handleAutoSave = async () => {
        try {
            if(userNotes[selectedNoteIndex] == null){
                setSelectedNoteIndex(userNotes.length - 1)
                return;
            }
            
            const selectedNote = userNotes[selectedNoteIndex];

            if (selectedNote.content.trim() && selectedNote.title.trim()) {
                const noteToSend = {
                    id: selectedNote.id,
                    title: selectedNote.title,
                    content: selectedNote.content,
                };
                
                await axiosInstance.post(`/api/user_note/new`, noteToSend);

                showNotification("노트가 저장되었습니다");
            } 
        } catch (error) {
            alert(error.response?.data?.message || "유저노트 저장에 실패했습니다.");
        }
    };  

    return (
        <div>
            <div className="note-tabs">
            {userNotes.map((note, index) => (
                <div
                    key={note.id ? note.id : `${index}-${Date.now()}`} 
                    className={`note-tab ${selectedNoteIndex === index ? 'active' : ''}`}
                    onClick={() => handleNoteSelect(index)}
                    onDoubleClick={() => handleDoubleClickTitle(index)}
                >
                    {isEditingTitle === index ? (
                        <div className="title-input-container">
                            <input
                                type="text"
                                value={newNoteTitle}
                                onChange={handleTitleChange}
                                autoFocus
                                // onBlur={handleTitleSave}
                                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                            />
                            <button
                                className="delete-note-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // 클릭 이벤트 전파 막기
                                    setIsEditingTitle(false); // 제목 수정 모드 종료
                                    handleDeleteNote(index, e); // 삭제 함수에 이벤트 전달
                                }}
                            >
                                x
                            </button>
                        </div>
                    ) : (
                        note.title
                    )}
                </div>
            ))}

                {isEditingTitle === -1 && (
                    <div className="add-note-form">
                        <input
                            type="text"
                            value={newNoteTitle}
                            onChange={handleNoteChange}
                            autoFocus
                            placeholder="책갈피 제목 입력"
                            onKeyDown={(e) => e.key === "Enter" && handleSaveNewNote()}
                        />
                    </div>
                )}

                {!isEditingTitle && (
                    <button
                        className="add-note-btn"
                        onClick={handleAddNote}
                    >
                        +
                    </button>
                )}
            </div>

            <div id="editor" className="note-content"></div>
        </div>
    );
};

export default UserNote;
