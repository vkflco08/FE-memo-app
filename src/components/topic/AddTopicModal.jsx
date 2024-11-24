import React, { useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './AddTopicModal.css';

function AddTopicModal({ isOpen, onClose, setTopics }) {
  const [topicName, setTopicName] = useState('');

  if (!isOpen) return null;

  const handleAddTopic = async () => {
    if (!topicName.trim()) {
      alert("주제 이름을 입력하세요!");
      return;
    }

    try {
      // 새 주제 추가 요청
      await axiosInstance.post(`/api/topic/new/${topicName}`);
      const response = await axiosInstance.get('/api/topic/list'); // 새로 추가된 목록으로 업데이트
      setTopics(response.data.data);
      
      // 입력값 초기화
      setTopicName('');
      onClose(); // 모달 닫기
    } catch (error) {
      alert("주제를 추가하는데 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Topic</h3>
        <input
          className="new-topic-input"
          type="text"
          placeholder="Enter topic name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)} // 입력값 업데이트
        />
        <div className="modal-actions">
          <button className="edit-button" onClick={handleAddTopic}>Add</button>
          <button className="edit-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddTopicModal;
