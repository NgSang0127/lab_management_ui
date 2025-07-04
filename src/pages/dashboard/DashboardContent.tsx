import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isAfter, startOfWeek, endOfWeek } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import DailyCourseStatistic from '../../components/dashboard/DailyCourseStatistic.tsx';
import DetailsTable from '../../components/dashboard/DetailsTable.tsx';
import BarChart from '../../components/dashboard/BarChart.tsx';
import LabUsageChart from '../../components/dashboard/LabUsageChart.tsx';
import CustomAlert from '../../components/support/CustomAlert.tsx';

const DashboardContent = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Date | null>(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [endDate, setEndDate] = useState<Date | null>(endOfWeek(new Date(), { weekStartsOn: 1 }));
    const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(endOfWeek(new Date(), { weekStartsOn: 1 }));
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        handleApplyDates();
    }, []);

    const handleApplyDates = () => {
        if (!startDate || !endDate) {
            setErrorMessage(t('dashboard.errors.invalidDates'));
            setErrorOpen(true);
            return;
        }

        if (isAfter(startDate, endDate)) {
            setErrorMessage(t('dashboard.errors.startDate_big_endDate'));
            setErrorOpen(true);
            return;
        }

        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setErrorOpen(false);
        setErrorMessage('');
    };

    const handleCloseError = () => {
        setErrorOpen(false);
        setErrorMessage('');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mx: 'auto', p: 4 }}>
                <Helmet>
                    <title>Dashboard | Lab Management IT</title>
                </Helmet>
                <Typography
                    variant="h3"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: { xs: 1, sm: 2 },
                        letterSpacing: -0.5,
                    }}
                >
                    {t("dashboard.title")}
                </Typography>

                <CustomAlert
                    open={errorOpen}
                    message={errorMessage}
                    severity="error"
                    onClose={handleCloseError}
                />
                {/* Date filter */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 8, ml: 5 }}>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <DatePicker
                            label={t('dashboard.startDate')}
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                            format="dd/MM/yyyy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <DatePicker
                            label={t('dashboard.endDate')}
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                            format="dd/MM/yyyy"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyDates}
                            fullWidth
                        >
                            {t('dashboard.applyButton')}
                        </Button>
                    </Grid>
                </Grid>
                {/* Child components receiving appliedStartDate and appliedEndDate as props */}
                <Box sx={{ mb: 8 }}>
                    <DailyCourseStatistic
                        startDate={appliedStartDate ? format(appliedStartDate, 'dd/MM/yyyy') : ''}
                        endDate={appliedEndDate ? format(appliedEndDate, 'dd/MM/yyyy') : ''}
                        setError={setErrorMessage}
                        setErrorOpen={setErrorOpen}
                    />
                </Box>
                <Box sx={{ mb: 8 }}>
                    <DetailsTable
                        startDate={appliedStartDate ? format(appliedStartDate, 'dd/MM/yyyy') : ''}
                        endDate={appliedEndDate ? format(appliedEndDate, 'dd/MM/yyyy') : ''}
                        setError={setErrorMessage}
                        setErrorOpen={setErrorOpen}
                    />
                </Box>
                <Box sx={{ mb: 8 }}>
                    <BarChart />
                </Box>
                <Box sx={{ mb: 8, minHeight: 600 }}>
                    <LabUsageChart
                    />
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default DashboardContent;