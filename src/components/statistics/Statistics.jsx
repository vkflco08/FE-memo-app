import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import AverageMemoCreationTimeGraph from './AverageMemoCreationTimeGraph';
import MemoCreationProbabilityGraph from './MemoCreationProbabilityGraph';
import MemoLengthStatisticsGraph from './MemoLengthStatisticsGraph';
import './Statistics.css';

const Statistics = () => {
    const [statisticsData, setStatisticsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // API 요청하여 데이터 가져오기
                const response = await axiosInstance.get('/api/statistics/member');
                setStatisticsData(response.data); // response.data를 직접 사용
                
            } catch (error) {
                console.error("Failed to fetch statistics data:", error);
                alert("통계자료를 가져오는데 실패했습니다.");
            }
        };

        fetchData();
    }, []);

    if (!statisticsData) {
        return <div>로딩 중...</div>; // 데이터 로딩 중일 때 표시할 내용
    }

    const averageTime = statisticsData.data.averageMemoCreationTime
    const probability = statisticsData.data.memoCreationProbability
    const memoLengths = statisticsData.data.memoLengthStats

    return (
        <div className = "user-statistics">
            <MemoCreationProbabilityGraph probability={probability} />
            <hr className="divider" />
            <AverageMemoCreationTimeGraph averageTime={averageTime} />
            <hr className="divider" />
            <MemoLengthStatisticsGraph memoLengths={memoLengths} />
        </div>
    );
};

export default Statistics;
