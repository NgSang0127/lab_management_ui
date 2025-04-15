import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Button, Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel, ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridSortModel,
    GridToolbar,
    GridValueGetter,
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import debounce from 'lodash.debounce';
import {AssetHistoryResponse, fetchAssetHistories, Status} from '../../api/asset/assetApi.ts';
import { CustomNoRowsOverlay } from '../../utils/CustomNoRowsOverlay.tsx';
import CustomAlert from '../Support/CustomAlert.tsx';




const AssetHistoryManagement: React.FC = () => {

    const [histories, setHistories] = useState<AssetHistoryResponse[]>([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<AssetHistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);

    const statusOptions = [
        {value: Status.AVAILABLE, label: 'Available'},
        {value: Status.IN_USE, label: 'In Use'},
        {value: Status.MAINTENANCE, label: 'Maintenance'},
        {value: Status.RETIRED, label: 'Retired'},
        {value: Status.BORROWED, label: 'Borrowed'}
    ];


    const fetchHistories = useMemo(
        () =>
            debounce(
                async (
                    currentPage: number,
                    currentRowsPerPage: number,
                    currentKeyword: string,
                    currentStatuses: string,
                    currentSortBy?: string,
                    currentSortOrder?: string
                ) => {
                    setIsLoading(true);
                    try {
                        const response = await fetchAssetHistories(
                            currentPage,
                            currentRowsPerPage,
                            currentKeyword,
                            currentStatuses,
                            currentSortBy ,
                            currentSortOrder
                        );
                        setHistories(response.content || []);
                        setTotalElements(response.totalElements || 0);
                        setError(null);
                    } catch (err) {
                        setError(err.message || 'Failed to fetch asset histories.');
                    } finally {
                        setIsLoading(false);
                    }
                },
                300
            ),
        []
    );

    useEffect(() => {
        const validSortFields = ['assetName', 'username', 'previousStatus', 'newStatus', 'changeDate'];
        const sortBy = sortModel.length > 0 && validSortFields.includes(sortModel[0].field) ? sortModel[0].field : 'changeDate';
        const sortOrder = sortModel.length > 0 && sortModel[0].sort ? sortModel[0].sort : 'desc';
        const statusesStr = statusFilter.join(',');
        fetchHistories(page, rowsPerPage, keyword, statusesStr, sortBy, sortOrder);
        return () => {
            fetchHistories.cancel();
        };
    }, [page, rowsPerPage, keyword, statusFilter, sortModel, fetchHistories]);

    const handleDetailsOpen = (history: AssetHistoryResponse) => {
        setSelectedHistory(history);
        setOpenDetails(true);
    };

    const handleDetailsClose = () => {
        setOpenDetails(false);
        setSelectedHistory(null);
    };

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        const validSortFields = ['assetName', 'username', 'previousStatus', 'newStatus', 'changeDate'];
        if (newSortModel.length > 0) {
            const currentField = newSortModel[0].field;
            if (!validSortFields.includes(currentField)) {
                setSortModel([{ field: 'changeDate', sort: 'desc' }]);
            } else {
                setSortModel(newSortModel);
            }
        } else {
            setSortModel([{ field: 'changeDate', sort: 'desc' }]);
        }
        setPage(0);
    };

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'no',
            headerName: 'No.',
            width: 100,
            flex:1,
            sortable: false,
            filterable: false,
            valueGetter: ((value, row) => {
                const index = histories.findIndex(
                    (item) => item.assetId === row.assetId && item.changeDate === row.changeDate
                );
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            }) as GridValueGetter<AssetHistoryResponse>,
        },
        {
            field: 'assetName',
            headerName: 'Asset',
            width: 150,
            flex:2,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => row.assetName || 'N/A',
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 150,
            flex:2,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => row.username || 'N/A',
        },
        {
            field: 'previousStatus',
            headerName: 'Previous Status',
            width: 150,
            flex:2,
            sortable: true,
            filterable: false,
            renderCell: (params: GridRenderCellParams<AssetHistoryResponse, Status>) => {
                const status = params.value ;
                let chipColor: 'success' | 'primary' | 'warning' | 'error' | 'info' = 'info';
                switch (status) {
                    case Status.IN_USE:
                        chipColor = 'primary';
                        break;
                    case Status.AVAILABLE:
                        chipColor = 'success';
                        break;
                    case Status.MAINTENANCE:
                        chipColor = 'warning';
                        break;
                    case Status.RETIRED:
                        chipColor = 'error';
                        break;
                    case Status.BORROWED:
                        chipColor = 'info';
                        break;
                    default:
                        chipColor = 'info';
                }
                return (
                    <Chip
                        label={status}
                        color={chipColor}
                        size="small"
                        sx={{ width: '100px', borderRadius: '20px', justifyContent: 'center' }}
                    />
                );
            },
        },
        {
            field: 'newStatus',
            headerName: 'New Status',
            width: 150,
            flex:2,
            sortable: true,
            filterable: false,
            renderCell: (params: GridRenderCellParams<AssetHistoryResponse, string>) => {
                const status = params.value || 'N/A';
                let chipColor: 'success' | 'primary' | 'warning' | 'error' | 'info' = 'info';
                switch (status) {
                    case Status.IN_USE:
                        chipColor = 'primary';
                        break;
                    case Status.AVAILABLE:
                        chipColor = 'success';
                        break;
                    case Status.MAINTENANCE:
                        chipColor = 'warning';
                        break;
                    case Status.RETIRED:
                        chipColor = 'error';
                        break;
                    case Status.BORROWED:
                        chipColor = 'info';
                        break;
                    default:
                        chipColor = 'info';
                }
                return (
                    <Chip
                        label={status}
                        color={chipColor}
                        size="small"
                        sx={{ width: '100px', borderRadius: '20px', justifyContent: 'center' }}
                    />
                );
            },
        },
        {
            field: 'changeDate',
            headerName: 'Change Date',
            width: 180,
            flex:2,
            sortable: true,
            filterable: false,
            valueGetter: (value) => (value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : 'N/A'),
        },
        {
            field: 'remarks',
            headerName: 'Remarks',
            width: 200,
            flex:2,
            sortable: false,
            filterable: false,
            valueGetter: (value) => value || 'N/A',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => (
                <IconButton sx={{ color: 'info.main' }} onClick={() => handleDetailsOpen(row)}>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ], [histories, page, rowsPerPage]);

    return (
        <div className="p-6">
            <Typography variant="h4" className="pb-4">
                Asset History Management
            </Typography>

            <Box mb={4}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Search by Asset Name"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            variant="outlined"
                            fullWidth
                            placeholder="Search histories..."
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Filter Status</InputLabel>
                            <Select
                                multiple
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as string[]);
                                    setPage(0);
                                }}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                                label="Filter Status"
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        <Checkbox checked={statusFilter.indexOf(status.value) > -1}/>
                                        <ListItemText primary={status.label}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <CustomAlert
                open={!!error}
                message={error || ''}
                severity="error"
                onClose={() => setError(null)}
            />

            <Box sx={{ height: '600px', width: '100%' }}>
                <DataGrid
                    rows={histories}
                    columns={columns.map((col) => ({
                        ...col,
                        align: 'center',
                        headerAlign: 'center',
                    }))}
                    paginationMode="server"
                    rowCount={totalElements}
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    sortModel={sortModel}
                    sortingMode="server"
                    onSortModelChange={handleSortModelChange}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setRowsPerPage(newModel.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    loading={isLoading}
                    slots={{ toolbar: GridToolbar, noRowsOverlay: CustomNoRowsOverlay }}
                    slotProps={{
                        pagination: { showFirstButton: true, showLastButton: true },
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
                    getRowId={(row) => `${row.assetId}-${row.changeDate}`}
                />
            </Box>

            {/* Dialog chi tiết lịch sử */}
            <Dialog open={openDetails} onClose={handleDetailsClose} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', borderRadius: 1 }}
                >
                    History Details
                </DialogTitle>
                <DialogContent className="space-y-4" sx={{ p: 3 }} dividers>
                    {selectedHistory && (
                        <>
                            <Typography><strong>Asset ID:</strong> {selectedHistory.assetId || 'N/A'}</Typography>
                            <Typography><strong>Asset:</strong> {selectedHistory.assetName || 'N/A'}</Typography>
                            <Typography><strong>Username:</strong> {selectedHistory.username || 'N/A'}</Typography>
                            <Typography>
                                <strong>Previous Status:</strong> {selectedHistory.previousStatus || 'N/A'}
                            </Typography>
                            <Typography>
                                <strong>New Status:</strong> {selectedHistory.newStatus || 'N/A'}
                            </Typography>
                            <Typography>
                                <strong>Change Date:</strong>{' '}
                                {selectedHistory.changeDate
                                    ? format(new Date(selectedHistory.changeDate), 'dd/MM/yyyy HH:mm')
                                    : 'N/A'}
                            </Typography>
                            <Typography><strong>Remarks:</strong> {selectedHistory.remarks || 'N/A'}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDetailsClose}
                        variant="outlined"
                        sx={{ borderRadius: '20px', textTransform: 'none', px: 3 }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default React.memo(AssetHistoryManagement);