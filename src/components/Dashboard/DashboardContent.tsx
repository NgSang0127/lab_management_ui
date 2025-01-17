import LogTable from './Chart/LogTable';
import BarChart from "./Chart/BarChart";
import {TextField, Button, Container, Typography, Box} from '@mui/material';
import CustomAlert from "../Support/CustomAlert.tsx";
import Grid from '@mui/material/Grid2';
import {useState} from "react";
import LogDashboard from "./Chart/LogDashboard.tsx";



const DashboardContent = () => {
    const [startDate, setStartDate] = useState<string>('2024-11-01');
    const [endDate, setEndDate] = useState<string>('2024-12-02');

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleApplyDates = () => {
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMessage('Start Date cannot be after End Date.');
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
                Dashboard
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
                        label="Start Date"
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
                        label="End Date"
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
                        Apply Dates
                    </Button>
                </Grid>
            </Grid>
            {/* Các component con nhận startDate và endDate qua props */}
            <div className="mb-8">
                <LogDashboard startDate={startDate} endDate={endDate} setError={setErrorMessage} setErrorOpen={setErrorOpen}/>
            </div>
            <div className="mb-8">
                <LogTable startDate={startDate} endDate={endDate} setError={setErrorMessage} setErrorOpen={setErrorOpen}/>
            </div>
            <div>
                <BarChart />
            </div>
        </Box>
    );
};

export default DashboardContent;
