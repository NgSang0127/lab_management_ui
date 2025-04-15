import DetailsTable from './Chart/DetailsTable.tsx';
import BarChart from "./Chart/BarChart";
import {TextField, Button, Container, Typography, Box} from '@mui/material';
import CustomAlert from "../Support/CustomAlert.tsx";
import Grid from '@mui/material/Grid';
import {useState} from "react";
import DailyCourseStatistic from "./Chart/DailyCourseStatistic.tsx";
import {useTranslation} from "react-i18next";



const DashboardContent = () => {
    const {t}=useTranslation();
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleApplyDates = () => {
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMessage(t('dashboard.errors.startDate_big_endDate'));
            setErrorOpen(true);
            return;
        }

    };

    const handleCloseError = () => {
        setErrorOpen(false);
        setErrorMessage('');
    };

    return (
        <Box className="mx-auto ">
            <Typography variant="h4" gutterBottom className="pb-5 pl-5">
                {t('dashboard.title')}
            </Typography>
            <CustomAlert
                open={errorOpen}
                message={errorMessage}
                severity="error"
                onClose={handleCloseError}
            />
            {/* Bộ lọc ngày */}
            <Grid container spacing={2} alignItems="center" className="mb-8 ml-5 ">
                <Grid >
                    <TextField
                        label={t('dashboard.startDate')}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        slotProps={{
                            inputLabel: {
                            shrink: true,
                        }}}
                        variant="outlined"
                    />
                </Grid>
                <Grid >
                    <TextField
                        label={t('dashboard.endDate')}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        slotProps={{
                            inputLabel:{
                            shrink: true,
                        }}}
                        variant="outlined"
                    />
                </Grid>
                <Grid >
                    <Button variant="contained" color="primary" onClick={handleApplyDates}>
                        {t('dashboard.applyButton')}
                    </Button>
                </Grid>
            </Grid>
            {/* Các component con nhận startDate và endDate qua props */}
            <div className="mb-8">
                <DailyCourseStatistic startDate={startDate} endDate={endDate} setError={setErrorMessage} setErrorOpen={setErrorOpen}/>
            </div>
            <div className="mb-8">
                <DetailsTable startDate={startDate} endDate={endDate} setError={setErrorMessage} setErrorOpen={setErrorOpen}/>
            </div>
            <div>
                <BarChart />
            </div>
        </Box>
    );
};

export default DashboardContent;
