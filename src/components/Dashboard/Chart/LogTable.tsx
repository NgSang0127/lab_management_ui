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
    TextField,
    Button,
    CircularProgress,
    TablePagination, Typography,
} from "@mui/material";
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { getLogsBetween } from "../../../state/Dashboard/Reducer.ts";

const LogTable: React.FC = () => {
    const dispatch = useAppDispatch();

    const { logs, isLoading, error, page, totalElements } = useSelector(
        (state: RootState) => state.logs
    );

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // Gọi API khi có thay đổi ở bộ lọc hoặc trang/số hàng, và khi isFiltered là true
    useEffect(() => {
        if (isFiltered && startDate && endDate) {
            dispatch(
                getLogsBetween({
                    startDate,
                    endDate,
                    page,
                    size: rowsPerPage,
                })
            );
        }
    }, [isFiltered, startDate, endDate, page, rowsPerPage, dispatch]);

    // Xử lý thay đổi ngày bắt đầu và ngày kết thúc
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, dateType: "start" | "end") => {
        if (dateType === "start") {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    // Xử lý thay đổi trang
    const handleChangePage = (_event: unknown, newPage: number) => {
        if (startDate && endDate) {
            dispatch(
                getLogsBetween({
                    startDate,
                    endDate,
                    page: newPage,
                    size: rowsPerPage,
                })
            );
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);

        if (startDate && endDate) {
            dispatch(
                getLogsBetween({
                    startDate,
                    endDate,
                    page: 0, // Reset về trang đầu
                    size: newSize,
                })
            );
        }
    };

    return <div className=" h-full px-7">
        {/* Bộ lọc ngày */}
        <Typography variant="h5" className="pb-7">Details</Typography>
        <div className="flex mb-4 gap-4">
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e, "start")}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    }}}
                variant="outlined"
                className="w-48"
            />
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(e, "end")}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    }}}
                variant="outlined"
                className="w-48"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    if (startDate && endDate) {
                        setIsFiltered(true); // Chỉ set isFiltered khi nhấn nút Filter Logs
                        dispatch(
                            getLogsBetween({ startDate, endDate, page: 0, size: rowsPerPage })
                        );
                    }
                }}
                className="self-end"
            >
                Filter Logs
            </Button>
        </div>

        {/* Hiển thị dữ liệu logs */}
        {isLoading ? <div className="flex justify-center items-center">
                <CircularProgress />
            </div> : error.getLogsBetween ? <div className="flex justify-center items-center">
                <span>Error: {error.getLogsBetween}</span>
            </div> : <TableContainer component={Paper}>
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
                    sx={{ position: 'relative', left: '-10px' }}
                />
            </TableContainer>}
    </div>;
};

export default LogTable;
