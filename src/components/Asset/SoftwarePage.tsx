import React, { useEffect, useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, TextField, FormControlLabel, Checkbox, Chip,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridCellParams, GridToolbar,
} from '@mui/x-data-grid';
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    deleteSoftwareById,
    fetchSoftwares,
    postCreateSoftware,
    putUpdateSoftwareById,
    SoftwareResponse,
    SoftwareRequest
} from "../../api/asset/softwareApi.ts";
import {CustomNoRowsOverlay} from "../../utils/CustomNoRowsOverlay.tsx";

const SoftwarePage: React.FC = () => {
    const [data, setData] = useState<SoftwareResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Dialog create/update software
    const [openDialog, setOpenDialog] = useState(false);
    const [editSoftware, setEditSoftware] = useState<SoftwareResponse | null>(null);
    const [softwareName, setSoftwareName] = useState('');
    const [isFree, setIsFree] = useState(false);

    // Dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchSoftwares(page, rowsPerPage);
            if (res && res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching softwares.');
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
        setEditSoftware(null);
        setSoftwareName('');
        setIsFree(false);
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = (software: SoftwareResponse) => {
        setEditSoftware(software);
        setSoftwareName(software.softwareName);
        setIsFree(software.isFree);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSave = async () => {
        if (softwareName.trim() === '') {
            setError('Software name is required.');
            setSuccess(null);
            return;
        }

        const request: SoftwareRequest = { softwareName, isFree };

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            if (editSoftware) {
                await putUpdateSoftwareById(editSoftware.id, request);
                setSuccess('Software updated successfully.');
            } else {
                await postCreateSoftware(request);
                setSuccess('Software created successfully.');
            }
            await fetchData();
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
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
                await deleteSoftwareById(deleteId);
                setSuccess('Software deleted successfully.');
                await fetchData();
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const columns: GridColDef<SoftwareResponse>[] = [
        {
            field: 'id',
            headerName: 'No.',
            minWidth: 100,
            flex: 0.5,
            sortable: false,
            filterable: false,
            valueGetter: (value, row) => {
                const index = data.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            },
        },
        {
            field: 'softwareName',
            headerName: 'Name',
            minWidth: 200,
            flex: 2,
        },
        {
            field: 'isFree',
            headerName: 'Is Free',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => {
                const isFree = params.value;
                const label = isFree ? 'Yes' : 'No';
                const chipColor = isFree ? 'success' : 'default';

                return (
                    <Chip
                        label={label}
                        color={chipColor}
                        size="small"
                        sx={{
                            width: '70px',
                            fontWeight: 200,
                            borderRadius: '20px',
                            justifyContent: 'center',
                        }}
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 120,
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: GridCellParams) => (
                <>
                    <IconButton
                        sx={{ color: 'primary.main' }}
                        size="small"
                        onClick={() => handleOpenDialogEdit(params.row as SoftwareResponse)}
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
            <h2 className="text-2xl font-bold mb-4">Softwares</h2>

            <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                Create Software
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

            <Box sx={{ height: '700px', width: '100%', mt: 4 }}>
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
                            color: '#1976d2',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                        },
                        '--DataGrid-overlayHeight': '300px',
                    }}
                    disableRowSelectionOnClick
                />
            </Box>

            {/* Dialog Create/Update */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editSoftware ? 'Update Software' : 'Create Software'}</DialogTitle>
                <DialogContent className="space-y-4">
                    <TextField
                        label="Software Name"
                        value={softwareName}
                        onChange={(e) => setSoftwareName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ marginTop: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isFree}
                                onChange={(e) => setIsFree(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Is Free?"
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
                    <div>Are you sure you want to delete this software?</div>
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

export default SoftwarePage;