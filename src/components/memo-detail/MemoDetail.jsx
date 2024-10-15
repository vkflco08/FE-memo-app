import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../common/AxiosInstance';
import Loading from '../loading/Loading'; 
import './MemoDetail.css'; 

const MemoDetail = () => {
  const { date } = useParams(); 
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editedMemo, setEditedMemo] = useState({ title: '', content: '', date: date });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemo();
  }, [date]);

  const fetchMemo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/memo/${date}`);
      const memoData = response.data.data;
      setMemo(memoData);
      setEditedMemo({ title: memoData.title, content: memoData.content, date: memoData.date });
    } catch (error) {
      console.error("Failed to fetch memo:", error);
      alert("메모를 불러오던 중 오류가 발생했습니다.")
      navigate('/all-memos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMemo((prevMemo) => ({
      ...prevMemo,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/api/memo/new`, editedMemo);
      navigate('/all-memos'); // 수정 후 메인 페이지로 이동
    } catch (error) {
      console.error("Failed to update memo:", error.response.data);
    } finally {
        setLoading(false);
    }
  };

  if (!memo) {
    return <p>메모를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="memo-detail-container">
      {loading && <Loading />} {/* 로딩 화면 표시 */}
      <div className="memo-detail">
        <input
          type="text"
          name="title"
          value={editedMemo.title}
          onChange={handleInputChange}
          className="memo-title-input"
        />
        <textarea
          name="content"
          value={editedMemo.content}
          onChange={handleInputChange}
          className="memo-content-textarea"
        />
        <button onClick={handleSaveEdit} className="save-btn">저장</button>
      </div>
    </div>
  );
};

export default MemoDetail;
