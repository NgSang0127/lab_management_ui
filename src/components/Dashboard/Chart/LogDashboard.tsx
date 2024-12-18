import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, CircularProgress,  Card, CardContent, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { getCourseLogStatistics, getDailyLogStatistic } from "../../../state/Dashboard/Reducer.ts";
import { CourseLogStatistics, DailyLogStatistics } from "../../../state/Dashboard/Action.ts";

// Register các component của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const LogsDashboard: React.FC = () => {
    const dispatch = useAppDispatch();

    // State cho ngày bắt đầu và ngày kết thúc
    const [startDate, setStartDate] = useState<string>('2024-11-01');
    const [endDate, setEndDate] = useState<string>('2024-12-02');

    // Lấy dữ liệu thống kê từ Redux store
    const { dailyStats, courseStats, isLoading, error } = useSelector((state: RootState) => state.logs);

    // Gọi API khi component mount hoặc khi ngày thay đổi
    useEffect(() => {
        if (startDate && endDate) {
            dispatch(getDailyLogStatistic({ startDate, endDate }));
            dispatch(getCourseLogStatistics({ startDate, endDate }));
        }
    }, [dispatch, startDate, endDate]);

    // Nếu đang tải, hiển thị loading spinner
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    // Nếu có lỗi
    if (error.getDailyLogStatistics || error.getCourseLogStatistics) {
        return <div className="text-red-500 text-center">{error.getDailyLogStatistics || error.getCourseLogStatistics}</div>;
    }

    // Chuyển đổi dữ liệu thống kê theo ngày thành dữ liệu biểu đồ
    const dailyLabels = dailyStats.map((stat: DailyLogStatistics) => stat.date);
    const dailyLogCount = dailyStats.map((stat: DailyLogStatistics) => stat.logCount);

    // Cấu hình biểu đồ thống kê theo ngày (Line Chart)
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

    // Chuyển đổi dữ liệu thống kê theo khóa học thành dữ liệu biểu đồ
    const courseLabels = courseStats.map((stat: CourseLogStatistics) => stat.courseName);
    const courseLogCount = courseStats.map((stat: CourseLogStatistics) => stat.logCount);

    // Cấu hình biểu đồ thống kê theo khóa học (Bar Chart)
    const courseChartData = {
        labels: courseLabels,
        datasets: [
            {
                label: 'Log Count',
                data: courseLogCount,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
        ],
    };

    return (
        <Container>
            {/* Chọn ngày */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid >
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        slotProps={{
                            inputLabel:{
                            shrink: true,
                        }}}
                    />
                </Grid>

                <Grid >
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        slotProps={{
                            inputLabel:{
                            shrink: true,
                        }}}
                    />
                </Grid>

                <Grid >

                    <Button
                        variant="contained"
                        onClick={() => {
                            if (startDate && endDate) {
                                dispatch(getDailyLogStatistic({ startDate, endDate }));
                                dispatch(getCourseLogStatistics({ startDate, endDate }));
                            }
                        }}
                    >
                        Apply Dates
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Biểu đồ thống kê theo ngày (Line Chart) */}
                <Grid size={{xs:12,md:6}}>
                    <Card className="shadow-lg">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Daily Log Statistics</Typography>
                            <div className="h-64">
                                <Line data={dailyChartData} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Biểu đồ thống kê theo khóa học (Bar Chart) */}
                <Grid size={{xs:12,md:6}}>
                    <Card className="shadow-lg">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Course Log Statistics</Typography>
                            <div className="h-64">
                                <Bar data={courseChartData} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LogsDashboard;
