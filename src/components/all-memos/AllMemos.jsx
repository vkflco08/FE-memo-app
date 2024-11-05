import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading'; 
import './AllMemos.css'; 

const AllMemos = () => {
  const [memos, setMemos] = useState([]);
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
    fetchMemos(true); // 초기 메모 로드
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0); // 페이지 초기화
      setMemos([]); // 이전 메모 초기화
      fetchMemos(true); // 새로운 검색에 대한 메모 불러오기
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  useEffect(() => {
    if (page >= 0) {
      fetchMemos(false); // 페이지 변경 시 메모 가져오기
    }
  }, [page]);

  const fetchMemos = async (isSearch) => {
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const apiUrl = searchKeyword ? `/api/memo/search` : `/api/memo/all`;
      const params = searchKeyword 
        ? { page, size: 5, keyword: searchKeyword } 
        : { page, size: 5 };

      const response = await axiosInstance.get(apiUrl, { params });
      const newMemos = response.data.data.content;
      setTotalPages(response.data.data.totalPages); // 전체 페이지 수 계산

      if (Array.isArray(newMemos)) {
        setMemos(newMemos); // 이전 메모와 합치지 않고 해당 페이지의 메모만 설정
      }

    } catch (error) {
      console.error("Failed to fetch memos:", error);
      setMemos([]);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleMemoClick = (date) => {
    navigate(`/memo/${date}`);
  };

  const handleDeleteMemo = async (formattedMonth) => {
    if (window.confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      setLoading(true); 
      try {
        await axiosInstance.delete(`/api/memo/${formattedMonth}`);
        // 메모 삭제 후 상태 업데이트
        setMemos(prevMemos => prevMemos.filter(memo => memo.date !== formattedMonth));
      } catch (error) {
        console.error("메모 삭제 실패:", error);
      } finally {
        setLoading(false); 
      }
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) { // 전체 페이지를 넘지 않도록 조건 추가
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prevPage => prevPage - 1);
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
        {memos.length > 0 ? (
          memos.map((memo) => (
            <div className="content-container" key={memo.date}>
              <li className="memo-item" onClick={() => handleMemoClick(memo.date)}>
                <h3>{memo.title}</h3>
                <p>{truncateContent(memo.content, 100)}</p>
                <div className="memo-date">{memo.date}</div>
                <button 
                  className="delete-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMemo(memo.date);
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
          className="pagination-button" // 이전 버튼 클래스 추가
          onClick={handlePreviousPage} 
          disabled={page === 0}
        >
          이전
        </button>
        <span className="pagination-info">{`현재 페이지: ${page + 1} / 총 페이지: ${totalPages}`}</span> {/* 현재 페이지 및 총 페이지 표시 */}
        <button 
          className="pagination-button" // 다음 버튼 클래스 추가
          onClick={handleNextPage} 
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );  
};

export default AllMemos;
