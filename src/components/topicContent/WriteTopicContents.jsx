import React, { useState, useEffect } from "react";
import axiosInstance from "../common/AxiosInstance"; // axiosInstance 사용
import { useNavigate } from 'react-router-dom';
import "./WriteTopicContents.css"; // 스타일을 위한 별도 CSS 파일

const WriteTopicContents = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(0); // topicId 저장
  const [newTopic, setNewTopic] = useState("");
  const [isAddTopicPopupOpen, setIsAddTopicPopupOpen] = useState(false);
  const navigate = useNavigate();

  // 시리즈 목록 가져오기
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axiosInstance.get("/api/topic/list");
      // 응답 데이터에서 topicName이 비어있지 않은 것만 필터링
      if (response.data && response.data.data) {
        const validTopics = response.data.data.filter(topic => topic.topicName);
        setTopics(validTopics); // 유효한 토픽만 상태에 설정
      } else {
        console.error("응답 데이터가 없습니다.");
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      alert("시리즈 목록을 불러오는 데 실패했습니다.");
    }
  };

  // 시리즈 추가
  const handleAddTopic = async () => {
    if (!newTopic.trim()) {
      alert("시리즈 이름을 입력해주세요.");
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/api/topic/new/${newTopic}`);
      const addedTopicId = response.data.data;  // 새로 추가된 토픽의 ID

      // 주제 추가 성공 시, 상태 업데이트
      setTopics((prevTopics) => {
        const updatedTopics = [{ topicId: addedTopicId, topicName: newTopic }, ...prevTopics]; // 새 토픽을 맨 앞에 추가
        return updatedTopics;
      });

      setSelectedTopicId(addedTopicId);  // 새 토픽을 자동으로 선택
      fetchTopics();
      setNewTopic(""); // 입력 초기화
      alert("새로운 시리즈가 추가되었습니다.");
      setIsAddTopicPopupOpen(false); // 팝업 닫기
    } catch (error) {
      console.error("Failed to add topic:", error);
      alert("새로운 시리즈 추가에 실패했습니다.");
    }
  };  

  // 글 저장
  const handleSavePost = async () => {
    if (!title.trim() || !content.trim() || !selectedTopicId) {
      alert("제목, 내용, 시리즈를 모두 선택해주세요.");
      return;
    }

    try {
      const payload = {
        topicId: selectedTopicId,
        contentId: null, // 새 글 작성이므로 contentId는 null
        title,
        content,
      };

      const response = await axiosInstance.post(`/api/topic-content/new`, payload);
      alert("글이 성공적으로 저장되었습니다.");
      setTitle("");
      setContent("");
      setSelectedTopicId(0); // 초기화

      const responseData = response.data.data
      navigate(`/topic/${responseData.topicId}`, {
        state: { topicName: responseData.topicName }, 
      });
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("글 저장에 실패했습니다.");
    }
  };

  // 엔터 키로 저장 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 동작 방지
      handleSavePost();
    }
  };

  const handleNewTopicKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 동작 방지
      handleAddTopic();
    }
  };

  return (
    <div className="topic-editor-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}  // 엔터 키 눌렀을 때 호출
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}  // 엔터 키 눌렀을 때 호출
        />
      </div>

      <hr className="topic-divider" />

      {/* 시리즈 선택 */}
      <div className="topic-selection">
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(Number(e.target.value))}
        >
          <option value="">시리즈를 선택하세요</option>
          {topics.map((topic, index) => (
            <option key={topic.topicId || index} value={topic.topicId}>
              {topic.topicName}
            </option>
          ))}
        </select>

        {/* 시리즈 추가 버튼 클릭 시 팝업 열기 */}
        <button className="save-series" onClick={() => setIsAddTopicPopupOpen(true)}>
          + 추가
        </button>
      </div>

      {/* 시리즈 추가 팝업 */}
      {isAddTopicPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-title">New Series</div>
            <button className="delete-button" onClick={() => setIsAddTopicPopupOpen(false)}>
              X
            </button>

            <input
              type="text"
              placeholder="새로운 시리즈 이름"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={handleNewTopicKeyDown}
            />

            <button className="save-series" onClick={handleAddTopic}>
              추가하기
            </button>
          </div>
        </div>
      )}

      <button className="save-post" onClick={handleSavePost}>
        저장하기
      </button>
    </div>
  );
};

export default WriteTopicContents;
