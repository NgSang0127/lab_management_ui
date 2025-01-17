
import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination,
    IconButton
} from '@mui/material';

import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import {
    deleteLocationById,
    fetchLocations,
    LocationResponse,
    postCreateLocation,
    putUpdateLocationById
} from "../../api/asset/locationApi.ts";
import { AxiosError } from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Location {
    id: number;
    name: string;
    address?: string;
}

const LocationPage: React.FC = () => {
    const [data, setData] = useState<LocationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // rowsPerPage = size
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Dialog create/update location
    const [openDialog, setOpenDialog] = useState(false);
    const [editLocation, setEditLocation] = useState<Location | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    // Dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Fetch data từ API
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchLocations(page , rowsPerPage); // Giả sử API page bắt đầu từ 1
            // Kiểm tra cấu trúc dữ liệu trả về từ API
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err :any) {
            if (err ) {
                setError(err.response?.data?.message || err.error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseError = () => {
        setError(null);
    };

    const handleCloseSuccess = () => {
        setSuccess(null);
    };

    const handleOpenDialogCreate = () => {
        setEditLocation(null);
        setName('');
        setAddress('');
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = (loc: Location) => {
        setEditLocation(loc);
        setName(loc.name);
        setAddress(loc.address || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        // Kiểm tra các trường bắt buộc
        if (name.trim() === '') {
            setError('Name is required.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            if (editLocation) {
                await putUpdateLocationById(editLocation.id, { name, address });
                setSuccess('Location updated successfully.');
            } else {
                // Loại bỏ trường id khi tạo mới
                await postCreateLocation({ name, address });
                setSuccess('Location created successfully.');
            }
            await fetchData();
            handleCloseDialog();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };


    // Mở dialog xóa
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (deleteId !== null) {
            try {
                setLoading(true);
                setError(null);
                await deleteLocationById(deleteId);
                setSuccess('Location deleted successfully.');
                await fetchData();
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || err.message);
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Locations</h2>

            <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                Create Location
            </Button>

            {/* Loading Indicator */}
            <LoadingIndicator open={loading} />

            {/* Hiển thị alert error (nếu có) */}
            <CustomAlert
                open={!!error}
                message={error || ''}
                severity="error" // Mặc định
                onClose={handleCloseError}
            />

            {/* Hiển thị alert success (nếu có) */}
            <CustomAlert
                open={!!success}
                message={success || ''}
                severity="success"
                onClose={handleCloseSuccess}
            />

            {!loading && (
                <div className="mt-4">
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="locations">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((loc, index) => {
                                    const rowNumber = page * rowsPerPage + index + 1; // tính số thứ tự
                                    return (
                                        <TableRow key={loc.id}>
                                            <TableCell>{rowNumber}</TableCell>
                                            <TableCell>{loc.id}</TableCell>
                                            <TableCell>{loc.name}</TableCell>
                                            <TableCell>{loc.address}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    sx={{ color: 'primary.main' }}  // Màu xanh
                                                    size="small"
                                                    onClick={() => handleOpenDialogEdit(loc)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    sx={{ color: 'error.main' }}  // Màu đỏ
                                                    size="small"
                                                    onClick={() => handleDeleteClick(loc.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No locations found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalElements}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </div>
            )}

            {/* Dialog Create/Update */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editLocation ? 'Update Location' : 'Create Location'}</DialogTitle>
                <DialogContent className="space-y-4">
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Xác nhận Xóa */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this location?</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};

export default LocationPage;
