import React, { useState } from 'react';
import './Topic.css'

function TopicCard({ topicId, name, contentNum, onUpdateTopicName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleUpdate = () => {
    onUpdateTopicName(topicId, newName);
    setIsEditing(false);
  };

  return (
    <div className="topic-card">
      {isEditing ? (
        <input
          className="topic-input"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      ) : (
        <h3>{name}</h3>
      )}
      <p>포스팅 개수: {contentNum}</p>
      {!isEditing && <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>}
      {isEditing && <button className="edit-button" onClick={handleUpdate}>저장</button>}
    </div>
  );
}

export default TopicCard;
