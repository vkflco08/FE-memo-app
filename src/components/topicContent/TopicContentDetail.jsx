import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../common/AxiosInstance';
import Loading from '../loading/Loading'; 
import './TopicContentDetail.css'; // 스타일 파일을 추가할 수 있습니다.

const TopicContentDetail = () => {
  const { contentId } = useParams(); 
  const [topicContent, setTopicContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editedTopicContent, setEditedTopicContent] = useState({ topicId: '', contentId: '', title: '', content: '' });
  const location = useLocation();
  const { topicId } = location.state || {}; 
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopicContent();
  }, [contentId]);

  const fetchTopicContent = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/topic-content/${contentId}`);
      const topicContentData = response.data.data;
      setTopicContent(topicContentData);
      setEditedTopicContent({ 
        topicId: Number(topicId),
        contentId: topicContentData.contentId,
        title: topicContentData.title, 
        content: topicContentData.content, 
      });
    } catch (error) {
      // console.error("Failed to fetch memo:", error);
      alert("메모를 불러오던 중 오류가 발생했습니다.")
      navigate(`/topic/${topicId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTopicContent((prevTopicContent) => ({
      ...prevTopicContent,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/api/topic-content/edit`, editedTopicContent);
      navigate(`/topic/${topicId}`); // 수정 후 주제 컨텐츠 페이지로 이동
    } catch (error) {
      // console.error("Failed to update memo:", error.response.data);
      alert("메모 저장에 실패했습니다.", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="topic-content-detail-container">
      {loading && <Loading />} {/* 로딩 화면 표시 */}
      <div className="topic-content-detail">
        <input
          type="text"
          name="title"
          value={editedTopicContent.title}
          onChange={handleInputChange}
          className="topic-content-title-input"
        />
        <textarea
          name="content"
          value={editedTopicContent.content}
          onChange={handleInputChange}
          className="topic-content-textarea"
        />
        <button onClick={handleSaveEdit} className='save-btn'>수정</button>
      </div>
    </div>
  );
};

export default TopicContentDetail;
