import React, { useEffect, useState } from 'react';
import {
    Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridCellParams, GridToolbar,
} from '@mui/x-data-grid';
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
import {CustomNoRowsOverlay} from "../../utils/CustomNoRowsOverlay.tsx";

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

    // Pagination
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
            const res = await fetchLocations(page, rowsPerPage);
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

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

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSave = async () => {
        if (name.trim() === '') {
            setError('Name is required.');
            setSuccess(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            if (editLocation) {
                await putUpdateLocationById(editLocation.id, { name, address });
                setSuccess('Location updated successfully.');
            } else {
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
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

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
                setSuccess(null);
                await deleteLocationById(deleteId);
                setSuccess('Location deleted successfully.');
                await fetchData();
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || err.message);
                } else {
                    setError('An unexpected error occurred.');
                }
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const columns: GridColDef<LocationResponse>[] = [
        {
            field: 'id',
            headerName: 'No.',
            flex: 0.5,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => {
                const index = data.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            },
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            resizable:false
        },
        {
            field: 'address',
            headerName: 'Address',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params: GridCellParams) => (
                <>
                    <IconButton
                        sx={{ color: 'primary.main' }}
                        size="small"
                        onClick={() => handleOpenDialogEdit(params.row as Location)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        sx={{ color: 'error.main' }}
                        size="small"
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Locations</h2>

            <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                Create Location
            </Button>

            <CustomAlert
                open={!!error && !success}
                message={error || ''}
                severity="error"
                onClose={handleCloseError}
            />
            <CustomAlert
                open={!!success && !error}
                message={success || ''}
                severity="success"
                onClose={handleCloseSuccess}
            />

            <Box sx={{ height: '600px', width: '100%', mt: 4 }}>
                <DataGrid
                    rows={data}
                    columns={columns.map((col) => ({
                        ...col,
                        align: 'center',
                        headerAlign: 'center',
                    }))}

                    paginationMode="server"
                    rowCount={totalElements}
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setRowsPerPage(newModel.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    loading={loading}
                    slotProps={{
                        pagination: {
                            showFirstButton: true,
                            showLastButton: true,
                        },
                    }}
                    slots={{
                        toolbar: GridToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            color: '#1976d2',           // màu chữ tiêu đề (blue MUI)
                            fontWeight: 'bold',         // đậm chữ
                            fontSize: '0.95rem',        // size chữ
                        },
                        '--DataGrid-overlayHeight': '300px',

                    }}
                    disableRowSelectionOnClick
                />
            </Box>

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