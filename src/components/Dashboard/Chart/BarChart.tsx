import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { getUsageTimeUsers } from "../../../state/Dashboard/Reducer.ts";
import {
    TextField,
    Box,
    Typography,
    CircularProgress,
    TablePagination,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { SelectChangeEvent } from "@mui/material/Select";
import { UsageTimeUsers } from "../../../state/Dashboard/Action.ts";

// Constants for chart appearance
const CHART_BACKGROUND_COLOR = "rgba(54, 162, 235, 0.6)";
const MAX_USAGE_TIME_COLOR = "rgba(255, 99, 132, 0.5)";
const MAX_USAGE_TIME_BORDER_COLOR = "rgba(255, 99, 132, 1)";
const MAX_USAGE_TIME = 420; // 7 hours in minutes

// Format time in seconds to hours and minutes
const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

// Format chart data for Bar component
const formatChartData = (usageTimeUsers: UsageTimeUsers[]) => ({
    labels: usageTimeUsers.map((user) => user.user.username),
    datasets: [
        {
            label: "Usage Time (minutes)",
            data: usageTimeUsers.map((user) => Math.floor(user.totalUsageTime / 60)), // Convert to minutes
            backgroundColor: CHART_BACKGROUND_COLOR,
        },
        {
            label: "Maximum Allowed Time (7 hours)",
            data: usageTimeUsers.map(() => MAX_USAGE_TIME), // Same max time for all users
            backgroundColor: MAX_USAGE_TIME_COLOR,
            type: "line", // Display as a line
            borderColor: MAX_USAGE_TIME_BORDER_COLOR,
            borderWidth: 2,
        },
    ],
});

const BarChart: React.FC = () => {
    const dispatch = useAppDispatch();
    const { usageTimeUsers, isLoading, error, page, totalElements } = useSelector(
        (state: RootState) => state.logs
    );
    const [date, setDate] = useState<string>(""); // Default date
    const [role, setRole] = useState<string>(""); // Default role
    const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Default page size
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // Fetch data when date, role, page, or size changes
    useEffect(() => {
        if (isFiltered && date && role) {
            dispatch(
                getUsageTimeUsers({
                    date,
                    role,
                    page,
                    size: rowsPerPage,
                })
            );
        }
    }, [isFiltered, date, role, page, rowsPerPage, dispatch]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value); // Update date value
        setIsFiltered(true); // Set filter flag to true
    };

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        setRole(event.target.value); // Update role value
        setIsFiltered(true); // Set filter flag to true
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        if (date && role) {
            dispatch(
                getUsageTimeUsers({
                    date,
                    role,
                    page: newPage,
                    size: rowsPerPage,
                })
            );
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);

        if (date && role) {
            dispatch(
                getUsageTimeUsers({
                    date,
                    role,
                    page: 0, // Reset to the first page
                    size: newSize,
                })
            );
        }
    };

    const barChartData = formatChartData(usageTimeUsers);

    // Check if date is valid before formatting
    const formattedDate = isValid(new Date(date)) ? format(new Date(date), "dd/MM/yyyy") : "";
    const chartTitle = formattedDate
        ? `Usage Time on ${formattedDate} (${role})`
        : "Usage Time (No Date Selected)"; // Use fallback title if the date is invalid or not selected

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: { dataIndex: number, datasetIndex: number }) => {
                        if (context.datasetIndex === 0) {
                            const totalSeconds = usageTimeUsers[context.dataIndex].totalUsageTime;
                            return `Usage Time: ${formatTime(totalSeconds)}`;
                        }
                        if (context.datasetIndex === 1) {
                            return `Maximum Allowed: ${MAX_USAGE_TIME} minutes`;
                        }
                        return "";
                    },
                },
            },
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: chartTitle,
            },
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 60, // Step size in minutes
                },
                title: {
                    display: true,
                    text: "Usage Time (minutes)", // Unit: minutes
                },
                suggestedMax: MAX_USAGE_TIME + 60, // Allow some space above max time
            },
        },
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box ml={3}>
            {/* Filters */}
            <Box mb={2} display="flex" gap={2}>
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />
                <FormControl sx={{ width: 150 }}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        value={role}
                        onChange={handleRoleChange}
                        autoWidth
                    >
                        <MenuItem value="STUDENT">STUDENT</MenuItem>
                        <MenuItem value="TEACHER">TEACHER</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* No data available message */}
            {(error || usageTimeUsers.length === 0) && !isLoading && !date && !role && (
                <Box textAlign="center" mt={2}>
                    <Typography color="textSecondary" variant="h6">
                        No data available. Please select a date and role.
                    </Typography>
                </Box>
            )}

            {/* Bar Chart */}
            {date && role && usageTimeUsers.length > 0 && (
                <Bar data={barChartData} options={chartOptions} />
            )}

            {/* Pagination */}
            <Box mt={2} display="flex" justifyContent="center">
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
};

export default BarChart;
