import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading'; 
import './AllMemos.css'; 

const AllMemos = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    setLoading(true); 
    try {
      const response = await axiosInstance.get(`/api/memo/all`);
      const memos = response.data.data;
      setMemos(Array.isArray(memos) ? memos : []); 
    } catch (error) {
      console.error("Failed to fetch memos:", error);
      setMemos([]); 
    } finally {
      setLoading(false); 
    }
  };

  // 길이가 긴 메모 내용을 자르는 함수 (예: 100자까지만 표시)
  const truncateContent = (content, maxLength) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  // 메모 클릭 시 상세보기로 이동
  const handleMemoClick = (date) => {
    navigate(`/memo/${date}`);
  };

  return (
    <div className="all-memos-container">
      {loading && <Loading />}
      <h2>모든 메모 보기</h2>
      <ul className="memo-list">
        {memos.length > 0 ? (
          memos.map((memo) => (
            <li key={memo.date} className="memo-item" onClick={() => handleMemoClick(memo.date)}>
              <h3>{memo.title}</h3>
              <p>{truncateContent(memo.content, 100)}</p> {/* 내용 일부만 표시 */}
              <div className="memo-date">{memo.date}</div> {/* 날짜 표시 */}
            </li>
          ))
        ) : (
          <p>저장된 메모가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default AllMemos;
