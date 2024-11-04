import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Line 차트 사용
import './Statistics.css';

Chart.register(...registerables);

const MemoLengthStatisticsGraph = ({ memoLengths }) => {
    const lengths = memoLengths.lengths;

    // 메모 길이에 따른 빈도수 계산
    const lengthFrequency = lengths.reduce((acc, length) => {
        acc[length] = (acc[length] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(lengthFrequency).map(Number); // 글자 길이
    const dataValues = Object.values(lengthFrequency); // 해당 길이의 빈도수

    // 차트 데이터를 준비
    const data = {
        labels: labels,
        datasets: [{
            label: '메모 길이 분포',
            data: dataValues,
            borderColor: '#007bff', // 파란 계열 색상
            backgroundColor: 'rgba(0, 123, 255, 0.2)', // 배경색
            borderWidth: 2,
            fill: true, // 선 아래를 채우기
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: '#eee', // X축 글씨 색상 (다크 모드)
                },
            },
            y: {
                ticks: {
                    color: '#eee', // Y축 글씨 색상 (다크 모드)
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#eee', // Legend 텍스트 색상 (다크 모드)
                },
            },
            tooltip: {
                backgroundColor: '#333', // Tooltip 배경 색상
                titleColor: '#eee', // Tooltip 제목 색상
                bodyColor: '#eee', // Tooltip 본문 색상
            },
        },
    };

    return (
        <section className="stat-section">
            <h3>메모 길이 통계</h3>
            <div className="chart-box">
                <Line data={data} options={options} />
            </div>
        </section>
    );
};

export default MemoLengthStatisticsGraph;
