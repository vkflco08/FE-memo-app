import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import TopicCard from './TopicCard.jsx';
import AddTopicModal from './AddTopicModal';
import Loading from '../loading/Loading'; 
import './Topic.css';

function TopicList() {
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);  // 로딩 시작
        const response = await axiosInstance.get('/api/topic/member');
        setTopics(response.data.data);
      } catch (error) {
        alert("주제를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);  // 로딩 종료
      }
    };
    fetchTopics();
  }, []);

  const handleUpdateTopicName = async (topicId, newName) => {
    try {
      await axiosInstance.put('/api/topic/edit', {
        topicId: topicId,
        topicName: newName,
      });
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.topicId === topicId ? { ...topic, topicName: newName } : topic
        )
      );
    } catch (error) {
      alert("주제 이름을 업데이트하는데 실패했습니다.");
    }
  };

  const toggleModal = () => setModalOpen((prev) => !prev);

  return (
    <div className="topic-list-container">
      <div className="header">
        <h2>Your Topics</h2>
        <button className="add-topic-btn" onClick={toggleModal}>
          {isModalOpen ? "Cancel" : "+ Add Topic"}
        </button>
      </div>
      <hr className="topic-divider" />

      {isLoading ? (  // 로딩 중일 때 Loading 컴포넌트 표시
        <Loading />
      ) : (
        topics.length > 0 ? (
          <div className="topics">
            {topics.map((topic) => (
              <TopicCard 
                key={topic.topicId} 
                topicId={topic.topicId}
                name={topic.topicName} 
                contentNum={topic.contentNum} 
                onUpdateTopicName={handleUpdateTopicName}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>아직 주제가 없습니다. 새로운 주제를 추가해보세요!</p>
          </div>
        )
      )}
      
      {isModalOpen && <AddTopicModal isOpen={isModalOpen} onClose={toggleModal} setTopics={setTopics} />}
    </div>
  );
}

export default TopicList;
