import React, { useState, useEffect } from 'react';
import axiosInstance from '../common/AxiosInstance';
import Loading from '../loading/Loading';
import FileUpload from './FileUpload';
import './MyInfo.css'; // 스타일 파일 추가

const MyInfo = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: '', // 수정된 프로필 이미지 상태
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/api/member/info');
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          profileImage: response.data.data.profileImageBase64 || '',
        });
      } catch (error) {
        alert('내 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 이미지 파일 변경 처리
  const handleFileChange = (file) => {
    setFormData((prevData) => ({ ...prevData, profileImage: file }));
  };

  const handleSave = async () => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    
    // 프로필 이미지가 존재하면 FormData에 추가
    if (formData.profileImage && formData.profileImage instanceof File) {
      payload.append('profileImage', formData.profileImage);
    }
  
    // DTO를 문자열로 변환해서 추가
    payload.append('memberProfileDtoRequest', JSON.stringify({
      name: formData.name,
      email: formData.email,
    }));
    
    try {
      console.log("Saving data..."); // 추가된 로그
      const response = await axiosInstance.put('/api/member/info_edit', payload, {
        headers: {
          'Content-Type': 'multipart/form-data', // form-data 전송을 위한 헤더
        }
      });
      alert('프로필이 수정되었습니다.');
      setProfile(response.data.data);
      setIsEditMode(false);
    } catch (error) {
      // console.error("Error during request:", error.response || error);
      alert('프로필 수정에 실패했습니다.');
    }
  };  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="my-info-container">
      {isLoading && <Loading />}
      <div className="my-info-profile-section">
      <img
          src={formData.profileImage instanceof File ? 
            URL.createObjectURL(formData.profileImage) : `data:image/jpeg;base64,${formData.profileImage}`}

          alt="Profile"
          className="my-info-profile-picture"
          />
        {isEditMode ? (       
          <FileUpload onChange={handleFileChange} />
        ):(<></>)}
        <div className="my-info-profile-details">
          {isEditMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="my-info-input"
            />
          ) : (
            <h2>{profile.name}</h2>
          )}
          <p>{profile.loginId}</p>
        </div>
      </div>
      <div className="my-info-additional-info">
        <p>
          <strong>아이디:</strong> {profile.loginId}
        </p>
        <p>
          <strong>이메일:</strong>{' '}
          {isEditMode ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="my-info-input"
            />
          ) : (
            profile.email
          )}
        </p>
        <p>
          <strong>가입 날짜:</strong>{' '}
          {profile.createdDate ? formatDate(profile.createdDate) : 'Unknown Date'}
        </p>
      </div>
      <div className="my-info-actions">
        {isEditMode ? (
          <button className="my-info-save-button" onClick={handleSave}>
            수정된 프로필 저장
          </button>
        ) : (
          <button className="my-info-edit-button" onClick={() => setIsEditMode(true)}>
            프로필 수정
          </button>
        )}
      </div>
    </div>
  );
};

export default MyInfo;
