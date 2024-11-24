import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopicCard.css';

function TopicCard({ topicId, topicName, contentNum }) {
  const navigate = useNavigate();

  const handleThemeClick = () => {
    navigate(`/topic/${topicId}`, {
      state: { topicName }, 
    });
  };

  return (
    <div className="topic-card" onClick={handleThemeClick}>
      <div className="topic-name">
        <div className="topic">{topicName}</div>
      </div>
      <div className="topic-actions">
        <p>포스팅 개수: {contentNum}</p>
      </div>
    </div>
  );
}

export default TopicCard;
