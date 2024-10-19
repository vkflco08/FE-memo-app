import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading'; 
import './AllMemos.css'; 

const AllMemos = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); 
  const [hasMore, setHasMore] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemos(); 
  }, []);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;
    if (bottom && !loading && hasMore) {
      setPage(prevPage => prevPage + 1); 
    }
  };

  useEffect(() => {
    if (page > 0) {
      fetchMemos();
    }
  }, [page]);

  const fetchMemos = async () => {
    setLoading(true); 
    try {
      const response = await axiosInstance.get(`/api/memo/all`, {
        params: { page, size: 10 }
      });
  
      const newMemos = response.data.data.content;
  
      if (Array.isArray(newMemos)) {
        setMemos(prevMemos => [...prevMemos, ...newMemos]);
      } else {
        console.error("Expected newMemos to be an array, got:", newMemos);
      }
  
      if (newMemos.length < 10) {
        setHasMore(false);
      }
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

  // 메모 삭제 함수
  const handleDeleteMemo = async (formattedMonth) => {
    if (window.confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      setLoading(true); 
      try {
        await axiosInstance.delete(`/api/memo/${formattedMonth}`);
        // 삭제 후 메모 목록을 새로고침
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        console.error("메모 삭제 실패:", error);
      } finally {
        setLoading(false); 
      }
    }
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  return (
    <div className="all-memos-container">
      {loading && <Loading />}
      <h2>모든 메모 보기</h2>
      <ul className="memo-list">
        {memos.length > 0 ? (
          memos.map((memo) => (
            <div class="content-container">
            <li key={memo.date} className="memo-item" onClick={() => handleMemoClick(memo.date)}>
              <h3>{memo.title}</h3>
              <p>{truncateContent(memo.content, 100)}</p> {/* 내용 일부만 표시 */}
              <div className="memo-date">{memo.date}</div> {/* 날짜 표시 */}
              <button 
                className="delete-button" 
                onClick={(e) => {
                  e.stopPropagation(); // 메모 클릭 이벤트 전파 방지
                  handleDeleteMemo(memo.date); // formattedMonth로 date를 사용
                }}
              >
                X
              </button>
            </li>
            </div>
          ))
        ) : (
          <p>저장된 메모가 없습니다.</p>
        )}
      </ul>
      {loading && <Loading />} {/* 추가적인 로딩 표시 */}
    </div>
  );
};

export default AllMemos;
