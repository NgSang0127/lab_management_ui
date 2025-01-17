
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Typography,
    CircularProgress,
} from "@mui/material";
import { RootState, useAppDispatch } from "../../../state/store";
import { getLogsBetween } from "../../../state/Dashboard/Reducer";
import CustomAlert from "../../Support/CustomAlert";

interface LogTableProps {
    startDate: string;
    endDate: string;
    setError: (msg: string) => void;
    setErrorOpen: (open: boolean) => void;
}

const LogTable: React.FC<LogTableProps> = ({ startDate, endDate, setError, setErrorOpen }) => {
    const dispatch = useAppDispatch();

    const { logs, isLoading, error, totalElements } = useSelector(
        (state: RootState) => state.logs
    );

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0); // Local state for page

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(
                getLogsBetween({
                    startDate,
                    endDate,
                    page,
                    size: rowsPerPage,
                })
            )
                .unwrap()
                .catch((err) => {
                    setError(err || 'Failed to fetch logs');
                    setErrorOpen(true);
                });
        }
    }, [dispatch, startDate, endDate, page, rowsPerPage, setError, setErrorOpen]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0); // Reset to first page
    };

    return (
        <div className="h-full px-7">
            <Typography variant="h5" className="pb-7">
                Log Details
            </Typography>
            <CustomAlert
                open={error.getLogsBetween ? true : false}
                message={error.getLogsBetween || ''}
                severity="error"
                onClose={() => setErrorOpen(false)}
            />
            {/* Display Logs */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            ) : error.getLogsBetween ? (
                <div className="flex justify-center items-center">
                    <span>Error: {error.getLogsBetween}</span>
                </div>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="logs table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Endpoint</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>IP Address</TableCell>
                                <TableCell>User Agent</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.timestamp}</TableCell>
                                        <TableCell>{log.endpoint}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.user.username}</TableCell>
                                        <TableCell>{log.course ? log.course.name : "N/A"}</TableCell>
                                        <TableCell>{log.ipAddress}</TableCell>
                                        <TableCell>{log.userAgent}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No logs found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        className="pr-5"
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        showFirstButton
                        showLastButton
                        sx={{ position: "relative", left: "-10px" }}
                    />
                </TableContainer>
            )}
        </div>
    );
};

export default LogTable;
