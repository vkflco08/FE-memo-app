import React from 'react';
import { Chart, registerables } from 'chart.js';
import './Statistics.css';

Chart.register(...registerables);

const MemoCreationProbabilityGraph = ({ probability }) => {
    return (
        <section className="stat-section">
            <h3>메모 작성 확률</h3>
            <p>{probability}%</p>
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${probability}%` }}
                />
            </div>
        </section>
    );
};

export default MemoCreationProbabilityGraph;
