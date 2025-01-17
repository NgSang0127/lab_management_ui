import React, { useEffect } from 'react';
import {
    Container, CircularProgress, Card, CardContent,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from "../../../state/store";
import { getCourseLogStatistics, getDailyLogStatistic } from "../../../state/Dashboard/Reducer";
import { CourseLogStatistics, DailyLogStatistics } from "../../../state/Dashboard/Action";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LogsDashboardProps {
    startDate: string;
    endDate: string;
    setError: (msg: string) => void;
    setErrorOpen: (open: boolean) => void;
}

const LogsDashboard: React.FC<LogsDashboardProps> = ({ startDate, endDate, setError, setErrorOpen }) => {
    const dispatch = useAppDispatch();

    const { dailyStats, courseStats, isLoading } = useSelector((state: RootState) => state.logs);


    useEffect(() => {
        if (startDate && endDate) {
            dispatch(getDailyLogStatistic({ startDate, endDate }))
                .unwrap()
                .catch((err) => {
                    setError(err || 'Failed to fetch daily logs');
                    setErrorOpen(true);
                });
            dispatch(getCourseLogStatistics({ startDate, endDate }))
                .unwrap()
                .catch((err) => {
                    setError(err || 'Failed to fetch course logs');
                    setErrorOpen(true);
                });
        }
    }, [dispatch, startDate, endDate, setError, setErrorOpen]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    // Daily chart data
    const dailyLabels = dailyStats.map((stat: DailyLogStatistics) => stat.date);
    const dailyLogCount = dailyStats.map((stat: DailyLogStatistics) => stat.logCount);

    const dailyChartData = {
        labels: dailyLabels,
        datasets: [
            {
                label: 'Log Count',
                data: dailyLogCount,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    // Giữ line chart options cho daily logs
    const dailyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {},
            y: { beginAtZero: true },
        },
    };

    const topCourseStats = [...courseStats]
        .sort((a: CourseLogStatistics, b: CourseLogStatistics) => b.logCount - a.logCount)
        .slice(0, 20);


    // Course chart data
    const courseLabels = topCourseStats.map(
        (stat: CourseLogStatistics) => `${stat.courseName} (TH:${stat.th}, NH:${stat.nh})`
    );
    const courseLogCount = courseStats.map((stat: CourseLogStatistics) => stat.logCount);


    const courseChartData = {
        labels: courseLabels,
        datasets: [
            {
                label: 'Count',
                data: courseLogCount,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
        ],
    };

    // Horizontal bar options
    const courseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,  // Horizontal bar
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                },
            },
            x: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false, // Ẩn legend nếu muốn
            },
        },
    };

    return (
        <Container maxWidth="xl">
            <Grid container spacing={4}>
                <Grid size={{xs:12}}>
                    <Card className="shadow-lg">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Daily Log Statistics
                            </Typography>
                            <div style={{width: '100%', overflowX: 'auto'}}>
                                <div style={{minWidth: '500px', height: '300px'}}>
                                    <Line data={dailyChartData} options={dailyChartOptions}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{xs: 12}}>
                    <Card className="shadow-lg">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top 20 Course Log Statistics
                            </Typography>
                            {/* Horizontal scroll */}
                            <div style={{ width: '100%', height: '400px', overflowX: 'auto' }}>
                                <div style={{ minWidth: '500px', height: '100%' }}>
                                    <Bar data={courseChartData} options={courseChartOptions} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LogsDashboard;
