import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Alert,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parse, isValid, isAfter, startOfWeek, endOfWeek } from 'date-fns';
import { fetchLabUsage, LabUsage } from '../../services/dashboard/usageLabApi.ts';


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const LabUsageChart: React.FC = () => {
  const [labUsage, setLabUsage] = useState<LabUsage[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date | null>(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    handleApply();
  }, []);

  const handleApply = async () => {
    if (!startDate || !endDate || !isValid(startDate) || !isValid(endDate)) {
      setError('Please select valid dates.');
      return;
    }

    if (isAfter(startDate, endDate)) {
      setError('Start date must be before end date.');
      return;
    }

    try {
      setError(null);
      const formattedStartDate = format(startDate, 'dd/MM/yyyy');
      const formattedEndDate = format(endDate, 'dd/MM/yyyy');
      const data = await fetchLabUsage(formattedStartDate, formattedEndDate);
      if (data) {
        setLabUsage(data);
      } else {
        setError('Unable to fetch lab usage data.');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
      console.error(err);
    }
  };

  const barData = {
    labels: labUsage.map((item) => item.roomName),
    datasets: [
      {
        label: 'Usage Percentage (%)',
        data: labUsage.map((item) => item.usagePercentage),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: labUsage.map((item) => item.roomName),
    datasets: [
      {
        label: 'Usage Percentage',
        data: labUsage.map((item) => item.usagePercentage),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Lab Usage Percentage (%)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Usage Percentage (%)' },
        max: 100,
      },
      x: {
        title: { display: true, text: 'Lab Room' },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12 }, // Smaller legend font
          padding: 10, // Reduced padding
        },
      },
      title: {
        display: true,
        text: 'Lab Usage Distribution',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw.toFixed(2)}%`,
        },
      },
    },
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'bar' | 'pie') => {
    setChartType(newValue);
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 4, mx: 'auto', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Lab Usage Statistics
          </Typography>

          {/* Date input */}
          <Grid container spacing={2} sx={{ mb: 3,mt:3 }} alignItems="center">
            <Grid size={{ xs: 12, sm: 2 }}>
              <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  format="dd/MM/yyyy"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  format="dd/MM/yyyy"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1 }}>
              <Button variant="contained" onClick={handleApply} fullWidth sx={{ bgcolor: '#2e3b55' }}>
                Apply
              </Button>
            </Grid>
          </Grid>

          {/* Display error if any */}
          {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
          )}

          {/* Tabs for chart type selection */}
          <Tabs
              value={chartType}
              onChange={handleTabChange}
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Bar Chart" value="bar" />
            <Tab label="Pie Chart" value="pie" />
          </Tabs>

          {/* Display chart */}
          {labUsage.length > 0 ? (
              <Box sx={{ mt: 3, bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1, minHeight: 550 }}>
                {chartType === 'bar' ? (
                    <Bar data={barData} options={barOptions} height={100} />
                ) : (
                    <Box sx={{ width: '100%', height: 500, maxWidth: 600, mx: 'auto' }}>
                      <Pie data={pieData} options={pieOptions} height={500} />
                    </Box>
                )}
              </Box>
          ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No data available to display.
              </Typography>
          )}
        </Box>
      </LocalizationProvider>
  );
};

export default LabUsageChart;