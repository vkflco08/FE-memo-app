import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Loading from '../loading/Loading'; 
import './AllTopicContent.css'

const AllTopicContents = () => {
  const { topicId } = useParams(); 
  const [topicContents, setTopicContents] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [searchLoading, setSearchLoading] = useState(false); 
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 추가
  const [searchKeyword, setSearchKeyword] = useState(''); 
  const navigate = useNavigate();

  const location = useLocation();
  const { topicName } = location.state || {}; // state로 전달된 값들


  const truncateContent = (content, maxLength) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  useEffect(() => {
    fetchTopicContents(true); // 초기 메모 로드
  }, [topicName]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchLoading) {  // 검색이 진행 중이지 않으면 호출
        setPage(0); // 페이지 초기화
        setTopicContents([]); // 이전 메모 초기화
        fetchTopicContents(true); // 새로운 검색에 대한 메모 불러오기
      }
    }, 500);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  useEffect(() => {
    if (page >= 0) {
      fetchTopicContents(false);
    }
  }, [page]);

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prevPage => prevPage - 1);
    }
  };

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNextPage();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [page, totalPages]); 

  const fetchTopicContents = async (isSearch) => {
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true); 
    }
  
    try {
      const apiUrl = searchKeyword ? `/api/topic-content/${topicId}/search` : `/api/topic-content/${topicId}`;
      console.log(apiUrl)
      const params = searchKeyword 
        ? { page, size: 5, keyword: searchKeyword } 
        : { page, size: 5 };
  
      const response = await axiosInstance.get(apiUrl, { params });
      const newTopicContents = response.data.data.content;
      setTotalPages(response.data.data.totalPages); 
  
      if (Array.isArray(newTopicContents)) {
        setTopicContents(newTopicContents); 
      }
  
    } catch (error) {
      console.error("Failed to fetch topicContents:", error);
      setTopicContents([]);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false); 
      }
    }
  };

  const handleTopicContentsClick = (topicContentsId) => {
    navigate(`/topicContents/${topicContentsId}`);
  };

  const handleDeleteMemo = async (topicContentsId) => {
    if (window.confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      setLoading(true);
      try {
        // 메모 삭제 요청
        await axiosInstance.delete(`/api/topic-content/${topicContentsId}`);
        // 메모 삭제 후 상태 업데이트
        setTopicContents(
          prevTopicContents => 
          prevTopicContents.filter(
            topicContents => 
            topicContents.contentId !== topicContentsId
          )
        );
  
      } catch (error) {
        console.error("메모 삭제 실패:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // 날짜 포맷 (YYYY-MM-DD 형식으로)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
  
    // 시간을 "H시 M분" 형식으로 포맷 (1시, 9분 등)
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${formattedDate} ${hours}시 ${minutes}분`;
  };  
  
  return (
    <div className="topic-content-container">
      <div className='topic-content-name'>{topicName}</div>
      <hr className="topic-divider" />
      <input 
        type="text" 
        value={searchKeyword} 
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="topic-title-search-input"
      />
      {searchLoading && (
        <div className="dots-loading">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      )}
      {/* 로딩 상태에 따라 조건부 렌더링 */}
      {!loading && topicContents.length > 0 ? (
        <ul className="memo-list">
          {topicContents.map((content) => {
            const uniqueKey = content.contentId;
            return (
              <div className="content-container" key={uniqueKey}>
                <li className="memo-item" onClick={() => handleTopicContentsClick(content.contentId)}>
                  <h3>{content.title}</h3>
                  <p className="memo-content">{truncateContent(content.content, 100)}</p>
                  <div className="memo-date">{content.date ? formatDate(content.date) : 'Unknown Date'}</div>
                  <button 
                    className="delete-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMemo(content.contentId); // 고유 id로 메모 삭제
                    }}
                  >
                    X
                  </button>
                </li>
              </div>
            );
          })}
        </ul>
      ) : (
        !searchLoading && <div className="no-results">검색 결과가 없습니다.</div>
      )}
      {loading && <Loading />}
      <div className="pagination">
        <button 
          className="pagination-button"
          onClick={handlePreviousPage} 
          disabled={page === 0}
        >
          이전
        </button>
        <span className="pagination-info">{`현재 페이지: ${page + 1} / 총 페이지: ${totalPages}`}</span>
        <button 
          className="pagination-button"
          onClick={handleNextPage} 
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AllTopicContents;
