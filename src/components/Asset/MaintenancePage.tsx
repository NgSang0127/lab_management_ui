import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridCellParams, GridToolbar,
} from '@mui/x-data-grid';
import { AxiosError } from 'axios';
import LoadingIndicator from "../Support/LoadingIndicator";
import CustomAlert from "../Support/CustomAlert";
import {
    MaintenanceRequest,
    MaintenanceResponse,
    MaintenanceStatus,
    fetchMaintenances,
    postCreateMaintenance,
    putUpdateMaintenanceById,
    deleteMaintenanceById,
} from "../../api/asset/maintenanceApi";
import AssetSelect from "./AssetSelect.tsx";
import { format } from "date-fns";
import { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {CustomNoRowsOverlay} from "../../utils/CustomNoRowsOverlay.tsx";

interface MaintenancePageProps {}

const MaintenancePage: React.FC<MaintenancePageProps> = () => {
    const [maintenances, setMaintenances] = useState<MaintenanceResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [editMaintenance, setEditMaintenance] = useState<MaintenanceRequest | null>(null);

    const [form, setForm] = useState<MaintenanceRequest>({
        assetId: 0,
        scheduledDate: "",
        status: MaintenanceStatus.SCHEDULED,
        remarks: "",
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchMaintenances(page, rowsPerPage, keyword, statusFilter);
            setMaintenances(res.content);
            setTotalElements(res.totalElements);
        } catch (err: any) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, keyword, statusFilter]);

    const handleOpenDialogCreate = () => {
        setEditMaintenance(null);
        setForm({
            assetId: 0,
            scheduledDate: "",
            status: MaintenanceStatus.SCHEDULED,
            remarks: "",
        });
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = (maintenance: MaintenanceResponse) => {
        setEditMaintenance(maintenance);
        setForm({
            assetId: maintenance.assetId,
            scheduledDate: new Date(maintenance.scheduledDate).toISOString().slice(0, 16),
            status: maintenance.status,
            remarks: maintenance.remarks || "",
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSave = async () => {
        if (form.assetId === 0) {
            setError("Asset ID is required.");
            setSuccess(null);
            return;
        }
        if (!form.scheduledDate) {
            setError("Scheduled date is required.");
            setSuccess(null);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            if (editMaintenance) {
                await putUpdateMaintenanceById((editMaintenance as MaintenanceResponse).id, form);
                setSuccess("Maintenance updated successfully.");
            } else {
                await postCreateMaintenance(form);
                setSuccess("Maintenance created successfully.");
            }
            handleCloseDialog();
            fetchData();
        } catch (err: any) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError("An unexpected error occurred.");
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
                await deleteMaintenanceById(deleteId);
                setSuccess("Maintenance deleted successfully.");
                await fetchData();
            } catch (err: any) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || err.message);
                } else {
                    setError("An unexpected error occurred.");
                }
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const columns: GridColDef<MaintenanceResponse>[] = [
        {
            field: 'id',
            headerName: 'No.',
            minWidth: 100,
            flex: 0.5,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => {
                const index = maintenances.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            },
        },
        {
            field: 'assetName',
            headerName: 'Asset Name',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'scheduledDate',
            headerName: 'Scheduled Date',
            minWidth: 180,
            flex: 1,
            renderCell: (params) => format(new Date(params.value), 'dd/MM/yyyy HH:mm'),
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'remarks',
            headerName: 'Remarks',
            minWidth: 200,
            flex: 2,
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
                        onClick={() => handleOpenDialogEdit(params.row as MaintenanceResponse)}
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
            <h2 className="text-2xl font-bold mb-4">Maintenance</h2>
            <Box display="flex" gap={2} mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                    Create Maintenance
                </Button>

                <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
                    <TextField
                        label="Keyword"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 10 },
                            maxWidth: '200px'
                        }}
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(0);
                        }}
                        placeholder="Search by remarks..."
                    />
                    <FormControl
                        variant="outlined"
                        sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
                    >
                        <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            label="Filter by Status"
                            value={statusFilter}
                            onChange={(e: SelectChangeEvent<string>) => {
                                setStatusFilter(e.target.value);
                                setPage(0);
                            }}
                        >
                            <MenuItem value="">
                                <em>All Status</em>
                            </MenuItem>
                            <MenuItem value={MaintenanceStatus.SCHEDULED}>SCHEDULED</MenuItem>
                            <MenuItem value={MaintenanceStatus.COMPLETED}>COMPLETED</MenuItem>
                            <MenuItem value={MaintenanceStatus.CANCELED}>CANCELED</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <CustomAlert
                open={!!error && !success}
                message={error || ""}
                severity="error"
                onClose={() => setError(null)}
            />
            <CustomAlert
                open={!!success && !error}
                message={success || ""}
                severity="success"
                onClose={() => setSuccess(null)}
            />

            <Box sx={{ height: '700px', width: '100%', mt: 4 }}>
                <DataGrid
                    rows={maintenances}
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMaintenance ? "Update Maintenance" : "Create Maintenance"}
                </DialogTitle>
                <DialogContent className="space-y-4" sx={{ mt: 5 }}>
                    <div className="mt-2">
                        {!editMaintenance && (
                            <AssetSelect
                                selectedAssetId={form.assetId !== 0 ? form.assetId : null}
                                setSelectedAssetId={(id) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        assetId: id || 0,
                                    }));
                                }}
                            />
                        )}
                    </div>
                    <TextField
                        label="Scheduled Date"
                        type="datetime-local"
                        fullWidth
                        value={form.scheduledDate}
                        onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="maintenance-status-label">Status</InputLabel>
                        <Select
                            labelId="maintenance-status-label"
                            label="Status"
                            value={form.status}
                            onChange={(e) =>
                                setForm({ ...form, status: e.target.value as MaintenanceStatus })
                            }
                        >
                            <MenuItem value={MaintenanceStatus.SCHEDULED}>SCHEDULED</MenuItem>
                            <MenuItem value={MaintenanceStatus.COMPLETED}>COMPLETED</MenuItem>
                            <MenuItem value={MaintenanceStatus.CANCELED}>CANCELED</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Remarks"
                        multiline
                        rows={3}
                        fullWidth
                        value={form.remarks}
                        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <div>Are you sure you want to delete this maintenance?</div>
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

export default MaintenancePage;