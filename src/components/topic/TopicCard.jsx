import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import './TopicCard.css';

function TopicCard({ topicId, topicName, contentNum, onDelete }) {
  const navigate = useNavigate();

  // 클릭 시, 해당 토픽으로 이동
  const handleThemeClick = () => {
    navigate(`/topic/${topicId}`, {
      state: { topicName },
    });
  };

  // 드래그 기능 설정
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TOPIC',
    item: { topicId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="topic-card"
      onClick={handleThemeClick}
      style={{ opacity: isDragging ? 0.5 : 1 }} // 드래그 중일 때 불투명도 조절
    >
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
