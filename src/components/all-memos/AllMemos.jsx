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
  const [hasMore, setHasMore] = useState(true); 
  const [searchKeyword, setSearchKeyword] = useState(''); 
  const navigate = useNavigate();

  const truncateContent = (content, maxLength) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      setMemos([]);
      setHasMore(true);
      fetchMemos(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;
    if (bottom && !loading && hasMore) {
      setPage(prevPage => prevPage + 1); 
    }
  };

  useEffect(() => {
    if (page > 0) {
      fetchMemos(false);
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
        ? { page, size: 10, keyword: searchKeyword } 
        : { page, size: 10 };

      const response = await axiosInstance.get(apiUrl, { params });
      const newMemos = response.data.data.content;

      if (Array.isArray(newMemos)) {
        setMemos(prevMemos => (page === 0 ? newMemos : [...prevMemos, ...newMemos]));
      }

      if (newMemos.length < 10) {
        setHasMore(false);
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
        window.location.reload(); 
      } catch (error) {
        console.error("메모 삭제 실패:", error);
      } finally {
        setLoading(false); 
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
            <div class="content-container" key={memo.date}>
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
          !searchLoading && <div class="no-results">검색 결과가 없습니다.</div>
        )}
      </ul>
      {loading && <Loading />}
    </div>
  );
};

export default AllMemos;
