import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import './Statistics.css';

Chart.register(...registerables);

const AverageMemoCreationTimeGraph = ({ averageTime }) => {
    const { averageHours, averageMinutes, averageSeconds, creationTimes } = averageTime;

    const hourCounts = Array(24).fill(0); 

    creationTimes.forEach(time => {
        const hour = moment(time).hour();
        hourCounts[hour] += 1; 
    });

    // Prepare chart data
    const data = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`), 
        datasets: [{
            label: '메모 작성 시간',
            data: hourCounts,
            borderColor: '#007bff', 
            fill: false,
            borderWidth: 2,
        }],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: '#111', // X축 글씨 색상 (다크 모드)
                },
            },
            y: {
                ticks: {
                    color: '#111', // Y축 글씨 색상 (다크 모드)
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#111', // Legend 텍스트 색상 (다크 모드)
                },
            },
            tooltip: {
                backgroundColor: '#111', // Tooltip 배경 색상
                titleColor: '#eee', // Tooltip 제목 색상
                bodyColor: '#eee', // Tooltip 본문 색상
            },
        },
    };
    
    return (
        <section className="stat-section">
            <h3>평균 메모 작성 시간</h3>
            <p>{`${averageHours.toFixed(0)}시 ${averageMinutes.toFixed(0)}분 ${Math.round(averageSeconds).toFixed(0)}초`}</p>
            <div className="chart-box">
                <Line data={data} options={options} />
            </div>
            <p className="description">사용자가 메모를 처음 작성한 시간을 기준으로 측정합니다.</p>
        </section>
    );
};

export default AverageMemoCreationTimeGraph;
