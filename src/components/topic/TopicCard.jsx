import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TopicCard.css'

function TopicCard({ topicId, topicName, contentNum, onUpdateTopicName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(topicName);
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 막음
    onUpdateTopicName(topicId, newName);
    setIsEditing(false);
  };

  const handleThemeClick = () => {
    if (!isEditing) { // 편집 모드일 때는 페이지 이동 방지
      navigate(`/topic/${topicName}`);
    }
  };

  return (
    <div className="topic-card" onClick={handleThemeClick}>
      <div className="topic-name">{isEditing ? (
        <input
          className="topic-input"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      ) : (
        topicName
      )}</div>
      <div className="topic-actions">
        <p>포스팅 개수: {contentNum}</p>
        {!isEditing && <button className="edit-button" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>수정</button>}
        {isEditing && <button className="edit-button" onClick={handleUpdate}>저장</button>}
      </div>
    </div>
  );
}

export default TopicCard;
