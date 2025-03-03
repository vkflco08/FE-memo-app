import React from 'react';
import { useDrop } from 'react-dnd';
import './TrashBin.css'; 
import trashBin from '../../assets/trash-bin.png';

function TrashBin({ onDelete }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TOPIC',
    drop: (item) => onDelete(item.topicId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`trash-bin ${isOver ? 'hover' : ''}`}
    >
      {/* 휴지통 아이콘 이미지 */}
      <img src={trashBin} alt="trash-bin" className="trash-icon" />
      {isOver}
    </div>
  );
}

export default TrashBin;
