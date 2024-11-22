import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading'; 

const AllTopicContents = () => {
  const [topicContents, setTopicContents] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [searchLoading, setSearchLoading] = useState(false); 
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 추가
  const [searchKeyword, setSearchKeyword] = useState(''); 
  const navigate = useNavigate();

  const truncateContent = (content, maxLength) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  useEffect(() => {
    fetchTopicContents(true); // 초기 메모 로드
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0); // 페이지 초기화
      setTopicContents([]); // 이전 메모 초기화
      fetchTopicContents(true); // 새로운 검색에 대한 메모 불러오기
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
  }, [page, totalPages]); // 페이지와 전체 페이지가 바뀔 때마다 이벤트 핸들러 새로 설정

  const fetchTopicContents = async (isSearch) => {
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const apiUrl = searchKeyword ? `/api/memo/search` : `/api/topic-content/${topicName}`;
      const params = searchKeyword 
        ? { page, size: 5, keyword: searchKeyword } 
        : { page, size: 5 };

      const response = await axiosInstance.get(apiUrl, { params });
      const newTopicContents = response.data.data.content;
      setTotalPages(response.data.data.totalPages); // 전체 페이지 수 계산

      if (Array.isArray(newTopicContents)) {
        setTopicContents(newTopicContents); // 이전 메모와 합치지 않고 해당 페이지의 메모만 설정
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

  const handleTopicContentsClick = (topicContents) => {
    navigate(`/topicContents/${topicContentsId}`);
  };

  const handleDeleteMemo = async (topicContentsId) => {
    if (window.confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      setLoading(true); 
      try {
        await axiosInstance.delete(`/api/topicContents/${topicContentsId}`);
        // 메모 삭제 후 상태 업데이트
        setTopicContents(prevTopicContents => prevTopicContents.filter(topicContents => topicContents.id !== topicContentsId));
      } catch (error) {
        console.error("메모 삭제 실패:", error);
      } finally {
        setLoading(false); 
      }
    }
  };

  return (
    <div className="all-memos-container">
      <input 
        type="text" 
        value={searchKeyword} 
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="search-input"
      />
      {searchLoading && (
        <div className="dots-loading">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      )}
      <ul className="memo-list">
        {topicContents.length > 0 ? (
          topicContents.map((topicContents) => (
            <div className="content-container" key={topicContents.date}>
              <li className="memo-item" onClick={() => handleTopicContentsClick(topicContents.date)}>
                <h3>{topicContents.title}</h3>
                <p>{truncateContent(topicContents.content, 100)}</p>
                <div className="memo-date">{topicContents.date}</div>
                <button 
                  className="delete-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMemo(topicContents.date);
                  }}
                >
                  X
                </button>
              </li>
            </div>
          ))
        ) : (
          !searchLoading && <div className="no-results">검색 결과가 없습니다.</div>
        )}
      </ul>
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
