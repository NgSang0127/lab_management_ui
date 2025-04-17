import React, {useEffect, useState} from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Autocomplete,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridCellParams, GridToolbar,
} from '@mui/x-data-grid';
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import {AxiosError} from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    deleteRoomById,
    fetchRooms,
    postCreateRoom,
    putUpdateRoomById,
    RoomResponse,
    RoomStatus
} from "../../services/asset/roomApi.ts";
import {fetchSoftwares, getSoftwaresByRoomId, SoftwareResponse} from '../../services/asset/softwareApi.ts';
import {CustomNoRowsOverlay} from "../../components/support/CustomNoRowsOverlay.tsx";
import {Helmet} from "react-helmet-async";

const Room: React.FC = () => {
    const [data, setData] = useState<RoomResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [openDialog, setOpenDialog] = useState(false);
    const [editRoom, setEditRoom] = useState<RoomResponse | null>(null);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [status, setStatus] = useState<RoomStatus>(RoomStatus.AVAILABLE);
    const [softwareList, setSoftwareList] = useState<SoftwareResponse[]>([]);
    const [selectedSoftwareIds, setSelectedSoftwareIds] = useState<number[]>([]);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchRooms(page, rowsPerPage);
            console.log('API Response:', res);
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSoftwaresData = async () => {
        try {
            const res = await fetchSoftwares(0, 20);
            if (res.content) {
                setSoftwareList(res.content);
            }
        } catch (error) {
            console.error("error fetching softwares", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchSoftwaresData();
    }, []);

    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

    const handleOpenDialogCreate = () => {
        setEditRoom(null);
        setName('');
        setLocation('');
        setCapacity(0);
        setStatus(RoomStatus.AVAILABLE);
        setSelectedSoftwareIds([]);
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = async (room: RoomResponse) => {
        setEditRoom(room);
        setName(room.name);
        setLocation(room.location);
        setCapacity(room.capacity);
        setStatus(room.status);
        try {
            const softwares = await getSoftwaresByRoomId(room.id);
            setSelectedSoftwareIds(softwares.map((s) => s.id));
        } catch (error) {
            console.error("Failed to fetch room's softwares", error);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSave = async () => {
        if (name.trim() === '' || location.trim() === '' || capacity <= 0) {
            setError('All fields are required.');
            setSuccess(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            if (editRoom) {
                await putUpdateRoomById(editRoom.id, {
                    name,
                    location,
                    capacity,
                    status,
                    softwareIds: selectedSoftwareIds
                });
                setSuccess('Room updated successfully.');
            } else {
                await postCreateRoom({name, location, capacity, status, softwareIds: selectedSoftwareIds});
                setSuccess('Room created successfully.');
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
                await deleteRoomById(deleteId);
                setSuccess('Room deleted successfully.');
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

    const columns: GridColDef<RoomResponse>[] = [
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
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'location',
            headerName: 'Location',
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'capacity',
            headerName: 'Capacity',
            minWidth: 120,
            flex: 0.5,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={RoomStatus[params.value as RoomStatus]}
                    color={params.value === RoomStatus.AVAILABLE ? 'success' : 'warning'}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 120,
            flex: 0.5,
            sortable: false,
            filterable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridCellParams) => (
                <>
                    <IconButton
                        sx={{color: 'primary.main'}}
                        size="small"
                        onClick={() => handleOpenDialogEdit(params.row as RoomResponse)}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        sx={{color: 'error.main'}}
                        size="small"
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Room | Lab Management IT</title>
            </Helmet>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Rooms</h2>

                <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                    Create Room
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

                <Box sx={{height: '600px', width: '100%', mt: 4}}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        paginationMode="server"
                        rowCount={totalElements}
                        paginationModel={{page, pageSize: rowsPerPage}}
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
                                color: 'primary.main',
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
                    <DialogTitle>{editRoom ? 'Update Room' : 'Create Room'}</DialogTitle>
                    <DialogContent className="space-y-4">
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            sx={{marginTop: 2}}
                        />
                        <TextField
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Capacity"
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            fullWidth
                            required
                        />
                        <Autocomplete
                            multiple
                            options={softwareList}
                            getOptionLabel={(option) => option.softwareName}
                            value={softwareList.filter((software) =>
                                selectedSoftwareIds.includes(software.id)
                            )}
                            onChange={(_event, newValue) => {
                                setSelectedSoftwareIds(newValue.map((software) => software.id));
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option.softwareName}
                                        {...getTagProps({index})}
                                        sx={{margin: 0.5}}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Software"
                                    placeholder="Search software..."
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                            disableCloseOnSelect
                            sx={{marginTop: 2}}
                        />
                        <FormControl fullWidth required sx={{marginTop: 2}}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as RoomStatus)}
                                label="Status"
                            >
                                {Object.values(RoomStatus).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

                {/* Dialog Confirm Delete */}
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <div>Are you sure you want to delete this room?</div>
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
        </>
    );
};

export default Room;