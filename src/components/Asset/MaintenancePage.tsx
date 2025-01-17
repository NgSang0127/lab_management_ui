import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    TablePagination, FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { AxiosError } from 'axios';
import LoadingIndicator from "../Support/LoadingIndicator";
import CustomAlert from "../Support/CustomAlert"; // Hoặc ErrorAlert
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
import {format} from "date-fns";
import {SelectChangeEvent} from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Đường dẫn tương ứng với code API bạn đưa

interface MaintenancePageProps {}

const MaintenancePage: React.FC<MaintenancePageProps> = () => {
    // State cho danh sách Maintenance
    const [maintenances, setMaintenances] = useState<MaintenanceResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Loading & Error & Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Dialog Create/Update
    const [openDialog, setOpenDialog] = useState(false);
    const [editMaintenance, setEditMaintenance] = useState<MaintenanceRequest | null>(null);

    // Form state
    const [form, setForm] = useState<MaintenanceRequest>({
        assetId: 0,
        scheduledDate: "",
        status: MaintenanceStatus.SCHEDULED,
        remarks: "",
    });

    // Dialog Xác Nhận Xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Fetch Maintenances
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, keyword, statusFilter]);

    // Pagination handlers
    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter handlers
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        setPage(0); // reset về trang đầu
    };
    const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value);
    };


    // Dialog create/update
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
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        // Validate
        if (form.assetId === 0) {
            setError("Asset ID is required.");
            return;
        }
        if (!form.scheduledDate) {
            setError("Scheduled date is required.");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            if (editMaintenance) {
                // Update
                await putUpdateMaintenanceById(
                    (editMaintenance as MaintenanceResponse).id,
                    form
                );
                setSuccess("Maintenance updated successfully.");
            } else {
                // Create
                await postCreateMaintenance(form);
                setSuccess("Maintenance created successfully.");
            }
            handleCloseDialog();
            fetchData(); // refresh
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

    // Delete
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
                await deleteMaintenanceById(deleteId);
                setSuccess("Maintenance deleted successfully.");
                await fetchData();
            } catch (err: any) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || err.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Maintenance</h2>

            {/* Filter Controls */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="Keyword"
                    variant="outlined"
                    value={keyword}
                    onChange={handleKeywordChange}
                    placeholder="Search by remarks..."
                />
                <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                    <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                    >
                        <MenuItem value="">
                            <em>All Status</em>
                        </MenuItem>
                        <MenuItem value={MaintenanceStatus.SCHEDULED}>
                            SCHEDULED
                        </MenuItem>
                        <MenuItem value={MaintenanceStatus.COMPLETED}>
                            COMPLETED
                        </MenuItem>
                        <MenuItem value={MaintenanceStatus.CANCELED}>
                            CANCELED
                        </MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                    Create Maintenance
                </Button>
            </Box>

            {/* Loading Indicator */}
            <LoadingIndicator open={loading} />

            {/* Error/Success Alert */}
            <CustomAlert
                open={!!error}
                message={error || ""}
                severity="error"
                onClose={() => setError(null)}
            />
            <CustomAlert
                open={!!success}
                message={success || ""}
                severity="success"
                onClose={() => setSuccess(null)}
            />

            {/* Table Maintenances */}
            <TableContainer component={Paper} className="mt-4">
                <Table size="small" aria-label="maintenance-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Asset Name</TableCell>
                            <TableCell>Scheduled Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maintenances.map((mtn, index) => {
                            const rowNumber = page * rowsPerPage + index + 1;
                            return (
                                <TableRow key={mtn.id}>
                                    <TableCell>{rowNumber}</TableCell>
                                    <TableCell>{mtn.assetName}</TableCell>
                                    <TableCell>{format(new Date(mtn.scheduledDate), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{mtn.status}</TableCell>
                                    <TableCell>{mtn.remarks}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            sx={{ color: 'primary.main' }}  // Màu xanh
                                            size="small"
                                            onClick={() => handleOpenDialogEdit(mtn)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: 'error.main' }}  // Màu đỏ
                                            size="small"
                                            onClick={() => handleDeleteClick(mtn.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {maintenances.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No maintenances found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
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
                    sx={{ position: 'relative', left: '-10px' }}
                />
            </Box>

            {/* Dialog Create/Update */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle >
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

            {/* Dialog Xác nhận Xóa */}
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
