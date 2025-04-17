import React, {useEffect, useMemo, useState} from 'react';
import {
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Avatar, Checkbox, ListItemText, Button,
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
import {useSelector} from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {format} from 'date-fns';
import debounce from 'lodash.debounce';
import {RootState} from '../../state/store.ts';
import {AssetSpecificResponse, fetchAssetsByUserId, Status} from '../../services/asset/assetApi.ts';
import {CustomNoRowsOverlay} from '../../components/support/CustomNoRowsOverlay.tsx';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import {Helmet} from "react-helmet-async";


const UserAssetManagement: React.FC = () => {
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const [assets, setAssets] = useState<AssetSpecificResponse[]>([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<AssetSpecificResponse | null>(null);
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


    const fetchUserAssets = useMemo(
        () =>
            debounce(
                async (
                    userId: number,
                    currentPage: number,
                    currentRowsPerPage: number,
                    currentKeyword: string,
                    currentStatuses: string,
                    currentSortBy?: string,
                    currentSortOrder?: string
                ) => {
                    setIsLoading(true);
                    try {
                        const response = await fetchAssetsByUserId(
                            userId,
                            currentPage,
                            currentRowsPerPage,
                            currentKeyword,
                            currentStatuses,
                            currentSortBy,
                            currentSortOrder
                        );
                        setAssets(response.content || []);
                        setTotalElements(response.totalElements || 0);
                        setError(null);
                    } catch (err: any) {
                        setError(err.message || 'Failed to fetch user assets.');
                    } finally {
                        setIsLoading(false);
                    }
                },
                300
            ),
        []
    );

    useEffect(() => {
        if (!currentUser?.id) {
            setError('user not logged in.');
            return;
        }
        const validSortFields = ['name', 'status', 'purchaseDate', 'price', 'categoryName', 'locationName'];
        const sortBy = sortModel.length > 0 && validSortFields.includes(sortModel[0].field) ? sortModel[0].field : 'name';
        const sortOrder = sortModel.length > 0 && sortModel[0].sort ? sortModel[0].sort : 'asc';
        const statusesStr = statusFilter.join(',');
        fetchUserAssets(currentUser.id, page, rowsPerPage, keyword, statusesStr, sortBy, sortOrder);
        return () => {
            fetchUserAssets.cancel();
        };
    }, [currentUser?.id, page, rowsPerPage, keyword, statusFilter, sortModel, fetchUserAssets]);

    const handleDetailsOpen = (asset: AssetSpecificResponse) => {
        setSelectedAsset(asset);
        setOpenDetails(true);
    };

    const handleDetailsClose = () => {
        setOpenDetails(false);
        setSelectedAsset(null);
    };

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        const validSortFields = ['name', 'status', 'purchaseDate', 'price', 'categoryName', 'locationName'];
        if (newSortModel.length > 0) {
            const currentField = newSortModel[0].field;
            if (!validSortFields.includes(currentField)) {
                setSortModel([{field: 'name', sort: 'asc'}]);
            } else {
                setSortModel(newSortModel);
            }
        } else {
            setSortModel([{field: 'name', sort: 'asc'}]);
        }
        setPage(0);
    };

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'no',
            headerName: 'No.',
            width: 100,
            flex: 1,
            sortable: false,
            filterable: false,
            valueGetter: ((value, row) => {
                const index = assets.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            }) as GridValueGetter<AssetSpecificResponse>,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            flex: 2,
            sortable: true,
            filterable: false,
            resizable: true,
            valueGetter: (value, row) => row.name || 'N/A',
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            flex: 1,
            sortable: true,
            filterable: false,
            renderCell: (params: GridRenderCellParams<AssetSpecificResponse, Status>) => {
                const status = params.value;

                const getLabel = (val: string | undefined) => {
                    switch (val) {
                        case Status.AVAILABLE:
                            return 'Available';
                        case Status.IN_USE:
                            return 'In Use';
                        case Status.MAINTENANCE:
                            return 'Maintenance';
                        case Status.RETIRED:
                            return 'Retired';
                        case Status.BORROWED:
                            return 'Borrowed';
                        default:
                            return 'N/A';
                    }
                };

                let chipColor: 'success' | 'primary' | 'warning' | 'default' | 'error' | 'info' = 'default';

                switch (status) {
                    case Status.AVAILABLE:
                        chipColor = 'success';
                        break;
                    case Status.IN_USE:
                        chipColor = 'primary';
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
                        chipColor = 'default';
                }

                return (
                    <Chip
                        label={getLabel(status)}
                        color={chipColor}
                        size="small"
                        sx={{width: '70px', fontWeight: 200, borderRadius: '20px', justifyContent: 'center'}}
                    />
                );
            },
        },
        {
            field: 'purchaseDate',
            headerName: 'Purchase Date',
            width: 180,
            flex: 2,
            sortable: true,
            filterable: false,
            valueGetter: (value) => (value ? format(new Date(value), 'dd/MM/yyyy') : 'N/A'),
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            flex: 1,
            sortable: true,
            filterable: false,
            type: 'number',
            valueFormatter: (value?: number) => {
                if (!value || typeof value !== 'number') {
                    return value;
                }
                return `${value.toLocaleString('vi-VN')}`;
            },
        },
        {
            field: 'categoryName',
            headerName: 'Category',
            width: 150,
            flex: 1,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => row.categoryName || 'N/A',
        },
        {
            field: 'locationName',
            headerName: 'Location',
            width: 150,
            flex: 1,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => row.locationName || 'N/A',
        },
        {
            field: 'roomName',
            headerName: 'Room',
            width: 150,
            flex: 1,
            sortable: true,
            filterable: false,
            valueGetter: (value, row) => row.roomName || 'N/A',
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 200,
            flex: 2,
            sortable: false,
            filterable: false,
            valueGetter: (value, row) => row.description || 'N/A',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 2,
            sortable: false,
            filterable: false,
            renderCell: ({row}) => (
                <IconButton sx={{color: 'info.main'}} onClick={() => handleDetailsOpen(row)}>
                    <VisibilityIcon/>
                </IconButton>
            ),
        },
    ], [assets, page, rowsPerPage]);

    return (
        <>
            <Helmet>
                <title>My Asset | Lab Management IT</title>
            </Helmet>
            <div className="p-6">
                <Typography variant="h4" className="pb-4">
                    My Assets
                </Typography>

                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                label="Search by Name"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setPage(0);
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {borderRadius: 10},
                                    maxWidth: '500px'
                                }}
                                variant="outlined"
                                fullWidth
                                placeholder="Search assets..."
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}} sx={{display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                            <FormControl fullWidth variant="outlined"
                                         sx={{maxWidth: 450, '& .MuiOutlinedInput-root': {borderRadius: 10}}}>
                                <InputLabel>Filter Status</InputLabel>
                                <Select
                                    multiple
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value as string[]);
                                        setPage(0);
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small"/>
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

                <Box sx={{height: '700px', width: '100%'}}>
                    <DataGrid
                        rows={assets}
                        columns={columns.map((col) => ({
                            ...col,
                            align: 'center',
                            headerAlign: 'center',
                        }))}
                        paginationMode="server"
                        rowCount={totalElements}
                        paginationModel={{page, pageSize: rowsPerPage}}
                        sortModel={sortModel}
                        sortingMode="server"
                        onSortModelChange={handleSortModelChange}
                        onPaginationModelChange={(newModel) => {
                            setPage(newModel.page);
                            setRowsPerPage(newModel.pageSize);
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        loading={isLoading}
                        slots={{toolbar: GridToolbar, noRowsOverlay: CustomNoRowsOverlay}}
                        slotProps={{
                            pagination: {showFirstButton: true, showLastButton: true},
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
                        getRowId={(row) => row.id}
                    />
                </Box>

                {/* Dialog chi tiết tài sản */}
                <Dialog open={openDetails} onClose={handleDetailsClose} maxWidth="sm" fullWidth>
                    <DialogTitle
                        sx={{
                            bgcolor: '#f5f5f5',
                            borderBottom: '1px solid #e0e0e0',
                            fontWeight: 'bold',
                            borderRadius: 1
                        }}
                    >
                        Asset Details
                    </DialogTitle>
                    <DialogContent className="space-y-4" sx={{p: 3}} dividers>
                        {selectedAsset && (
                            <>
                                <Typography><strong>ID:</strong> {selectedAsset.id || 'N/A'}</Typography>
                                <Typography><strong>Name:</strong> {selectedAsset.name || 'N/A'}</Typography>
                                {selectedAsset.image && (
                                    <Box sx={{textAlign: 'center', my: 2}}>
                                        <Avatar
                                            src={selectedAsset.image}
                                            alt={selectedAsset.name}

                                            sx={{
                                                width: 300,
                                                height: 300,
                                                borderRadius: 1,
                                                img: {
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                                <Typography><strong>Description:</strong> {selectedAsset.description || 'N/A'}
                                </Typography>
                                <Typography><strong>Status:</strong> {selectedAsset.status || 'N/A'}</Typography>
                                <Typography>
                                    <strong>Purchase Date:</strong>{' '}
                                    {selectedAsset.purchaseDate
                                        ? format(new Date(selectedAsset.purchaseDate), 'dd/MM/yyyy HH:mm')
                                        : 'N/A'}
                                </Typography>
                                <Typography>
                                    <strong>Price:</strong>{' '}
                                    {selectedAsset.price != null ? `${selectedAsset.price.toLocaleString('vi-VN')} VND` : 'N/A'}
                                </Typography>
                                <Typography><strong>Category:</strong> {selectedAsset.categoryName || 'N/A'}
                                </Typography>
                                <Typography><strong>Location:</strong> {selectedAsset.locationName || 'N/A'}
                                </Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDetailsClose}
                            variant="outlined"
                            sx={{borderRadius: '20px', textTransform: 'none', px: 3}}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default React.memo(UserAssetManagement);