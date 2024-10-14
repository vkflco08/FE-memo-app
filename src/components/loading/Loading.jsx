import React from 'react';
import './Loading.css'; // CSS 파일을 따로 작성하여 불러옵니다.

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-text">
                Loading
                <span className="dot1">.</span>
                <span className="dot2">.</span>
                <span className="dot3">.</span>
            </div>
        </div>
    );
};

export default Loading;
