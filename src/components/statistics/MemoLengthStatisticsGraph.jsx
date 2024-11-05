import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Line 차트 사용
import './Statistics.css';

Chart.register(...registerables);

const MemoLengthStatisticsGraph = ({ memoLengths }) => {
    const lengths = memoLengths.lengths;

    // 평균 메모 길이 계산
    const averageLength = lengths.reduce((sum, length) => sum + length, 0) / lengths.length || 0;

    // 구간 설정
    const numberOfBins = 30; // 구간의 개수
    const maxLength = Math.max(...lengths, 0); // 최대 메모 길이
    const binSize = Math.ceil((maxLength + 1) / numberOfBins); // 각 구간의 크기 (최대 길이 + 1)

    // 빈도수 배열 초기화
    const frequency = new Array(numberOfBins).fill(0);

    // 메모 길이를 구간에 따라 빈도수 계산
    lengths.forEach(length => {
        const binIndex = Math.min(Math.floor(length / binSize), numberOfBins - 1); // 해당 길이에 맞는 구간 인덱스
        frequency[binIndex] += 1; // 해당 구간의 빈도수 증가
    });

    // 구간 라벨 생성
    const labels = Array.from({ length: numberOfBins }, (_, i) => {
        const start = i * binSize;
        const end = start + binSize - 1;
        return `${start} - ${end}`; // 구간 형식
    });

    // 차트 데이터를 준비
    const data = {
        labels: labels,
        datasets: [{
            label: '메모 길이 분포',
            data: frequency,
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
                    color: '#111', // X축 글씨 색상 (다크 모드)
                },
            },
            y: {
                min: 0, // Y축 최소값
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
            <h3>메모 길이 통계</h3>
            <p>평균 메모 길이: {averageLength.toFixed(0)} 글자</p>
            <div className="chart-box">
                <Line data={data} options={options} />
            </div>
            <div className="average-length">
            </div>
        </section>
    );
};

export default MemoLengthStatisticsGraph;
