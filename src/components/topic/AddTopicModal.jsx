import React, { useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import './Topic.css'

function AddTopicModal({ isOpen, onClose, setTopics }) {
  const [topicName, setTopicName] = useState('');

  if (!isOpen) return null;

  const handleAddTopic = async () => {
    try {
      await axiosInstance.post(`/api/topic/new/${topicName}`);
      const response = await axiosInstance.get('/api/topic/member'); // 새로 추가된 목록으로 업데이트
      setTopics(response.data.data);
      setTopicName(null)
      onClose();
    } catch (error) {
        alert("주제를 추가하는데 실패했습니다.")
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <hr className="topic-divider" /> {/* 가로선 추가 */}
        <h3>Add New Topic</h3>
        <input
          className="topic-input"
          type="text"
          placeholder="Enter topic name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
        />
        <button className='edit-button' onClick={handleAddTopic}>Add</button>
        <button className='edit-button' onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddTopicModal;
