import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import TopicCard from './TopicCard.jsx';
import AddTopicModal from './AddTopicModal';
import Loading from '../loading/Loading'; 
import TrashBin from './TrashBin'; // 휴지통 컴포넌트 import
import './TopicList.css';

function TopicList() {
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/api/topic/list');
        setTopics(response.data.data);
      } catch (error) {
        alert("주제를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm("정말로 주제와 모든 메모들을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/api/topic/${topicId}`);
        setTopics((prevTopics) => prevTopics.filter(topic => topic.topicId !== topicId));
      } catch (error) {
        alert("주제를 삭제하는데 실패했습니다.");
      }
    }
  };

  const toggleModal = () => setModalOpen((prev) => !prev);

  return (
    <div className="topic-list-container">
      <div className="header">
        <div className='topic-main-title'>Your Topics</div>
        <button className="add-topic-btn" onClick={toggleModal}>
          + Add Topic
        </button>
      </div>
      <hr className="topic-divider" />

      {isLoading ? (
        <Loading />
      ) : (
        topics.length > 0 ? (
          <div className="topics">
            {topics.map((topic) => (
              <TopicCard 
                key={topic.topicId} 
                topicId={topic.topicId}
                topicName={topic.topicName} 
                contentNum={topic.contentNum} 
                onDelete={handleDeleteTopic}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>아직 주제가 없습니다. 새로운 주제를 추가해보세요!</p>
          </div>
        )
      )}

      <TrashBin onDelete={handleDeleteTopic} /> {/* 휴지통 컴포넌트 추가 */}

      {isModalOpen && <AddTopicModal isOpen={isModalOpen} onClose={toggleModal} setTopics={setTopics} />}
    </div>
  );
}

export default TopicList;
