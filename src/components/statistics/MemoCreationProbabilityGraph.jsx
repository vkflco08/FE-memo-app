import React from 'react';
import { Chart, registerables } from 'chart.js';
import './Statistics.css';

Chart.register(...registerables);

const MemoCreationProbabilityGraph = ({ probability }) => {
    return (
        <section className="stat-section">
            <h3>메모 작성 확률</h3>
            <p>{probability[0].toFixed(0)}%</p>
            <p>지금까지 <strong>{probability[1].toFixed(0)}</strong>개의 메모를 적었습니다.</p>
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${probability[0]}%` }}
                />
            </div>
            <p className="description">회원가입 날짜부터 현재까지의 메모 작성 확률을 나타냅니다.</p>
        </section>
    );
};

export default MemoCreationProbabilityGraph;
