import React, { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridRenderCellParams,
    GridSortModel,
    GridToolbar,
    GridValueGetter,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import '../../components/asset/Asset.css';
import {
    AssetRequest,
    AssetResponse,
    deleteAssetById,
    fetchAssets,
    OperationTime,
    postCreateAsset,
    postDuplicatedAsset,
    putUpdateAssetById,
    Status,
} from '../../services/asset/assetApi.ts';
import { CategoryResponse, fetchCategories } from '../../services/asset/categoryApi.ts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchLocations, LocationResponse } from '../../services/asset/locationApi.ts';
import { fetchRooms, RoomResponse } from '../../services/asset/roomApi.ts';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import { format } from 'date-fns';
import { uploadImageToCloudinary } from '../../utils/uploadCloudinary.ts';
import { SelectChangeEvent } from '@mui/material/Select';
import UserSelect from '../../components/asset/UserSelect.tsx';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import { CustomNoRowsOverlay } from '../../components/support/CustomNoRowsOverlay.tsx';
import { renderProgress } from '../../utils/progress.tsx';

const Asset: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [data, setData] = useState<AssetResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [sortModel, setSortModel] = useState<GridSortModel>([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [editAsset, setEditAsset] = useState<AssetResponse | null>(null);
    const [form, setForm] = useState<AssetRequest>({
        name: '',
        description: '',
        image: '',
        status: Status.AVAILABLE,
        price: 0,
        purchaseDate: new Date().toISOString().slice(0, 16),
        categoryId: 0,
        locationId: 0,
        roomId: 0,
        quantity: 1,
        warranty: 0,
        operationYear: 0,
        operationStartDate: '',
        operationTime: OperationTime.FULL_DAY,
        lifeSpan: 0,
        configurations: [],
        assignedUserId: 0,
    });

    // State for configurations input
    const [configKey, setConfigKey] = useState<string>('');
    const [configValue, setConfigValue] = useState<string>('');

    // Dialog for delete confirmation
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Dialog for details
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<AssetResponse | null>(null);

    // Data for selects
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [locations, setLocations] = useState<LocationResponse[]>([]);
    const [rooms, setRooms] = useState<RoomResponse[]>([]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Sort and filter state
    const [keyword, setKeyword] = useState<string>('');
    const [roomFilter, setRoomFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);

    // Menu state for actions
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const statusOptions = [
        { value: Status.AVAILABLE, label: 'Available' },
        { value: Status.IN_USE, label: 'In Use' },
        { value: Status.MAINTENANCE, label: 'Maintenance' },
        { value: Status.RETIRED, label: 'Retired' },
        { value: Status.BORROWED, label: 'Borrowed' },
    ];

    const handleStatusFilterChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setStatusFilter(value);
        setPage(0);
    };

    const handleCategoryFilterChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];
        setCategoryFilter(value);
        setPage(0);
    };

    const debouncedFetchData = useMemo(
        () =>
            debounce(
                (
                    currentPage: number,
                    currentRowsPerPage: number,
                    currentKeyword: string,
                    currentRoomFilter: string,
                    currentStatusFilter: string[],
                    currentCategoryFilter: number[],
                    currentSortModel: GridSortModel
                ) => {
                    fetchData(
                        currentPage,
                        currentRowsPerPage,
                        currentKeyword,
                        currentRoomFilter,
                        currentStatusFilter,
                        currentCategoryFilter,
                        currentSortModel
                    );
                },
                600
            ),
        []
    );

    const fetchData = async (
        currentPage: number,
        currentRowsPerPage: number,
        currentKeyword: string,
        currentRoomName: string,
        currentStatusFilter: string[] = [],
        currentCategoryFilter: number[] = [],
        currentSortModel?: GridSortModel
    ) => {
        try {
            setLoading(true);
            setError(null);
            const sortField = currentSortModel[0]?.field || 'id';
            const sortDirection = currentSortModel[0]?.sort || 'asc';
            const res = await fetchAssets(
                currentPage,
                currentRowsPerPage,
                currentKeyword,
                currentRoomName,
                currentStatusFilter.length > 0 ? currentStatusFilter.join(',') : '',
                currentCategoryFilter.length > 0 ? currentCategoryFilter.join(',') : '',
                sortField,
                sortDirection
            );
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err) {
            setError(err.message || t('manager_asset.errors.unexpected'));
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectData = async () => {
        try {
            const [categoriesRes, locationsRes, roomsRes] = await Promise.all([
                fetchCategories(0, 50),
                fetchLocations(0, 50),
                fetchRooms(0, 10),
            ]);
            if (categoriesRes.content) setCategories(categoriesRes.content);
            if (locationsRes.content) setLocations(locationsRes.content);
            if (roomsRes.content) setRooms(roomsRes.content);
        } catch (err) {
            console.error(t('manager_asset.errors.select_data'), err);
        }
    };

    useEffect(() => {
        debouncedFetchData(page, rowsPerPage, keyword, roomFilter, statusFilter, categoryFilter, sortModel);
        fetchSelectData();
        return () => debouncedFetchData.cancel();
    }, [page, rowsPerPage, keyword, roomFilter, statusFilter, categoryFilter, sortModel, debouncedFetchData]);

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        if (newSortModel.length > 0) {
            const currentField = newSortModel[0].field;
            const previousSort = sortModel[0]?.field === currentField ? sortModel[0]?.sort : null;

            if (!previousSort || previousSort === 'asc') {
                setSortModel([{ field: currentField, sort: 'desc' }]);
            } else if (previousSort === 'desc') {
                setSortModel([]);
            }
        } else {
            setSortModel(newSortModel);
        }
        setPage(0);
    };

    const handleOpenDialogCreate = () => {
        setEditAsset(null);
        setForm({
            name: '',
            description: '',
            image: '',
            price: 0,
            status: Status.AVAILABLE,
            purchaseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            categoryId: 0,
            locationId: 0,
            roomId: 0,
            quantity: 1,
            warranty: 0,
            operationYear: 0,
            operationStartDate: '',
            operationTime: OperationTime.FULL_DAY,
            lifeSpan: 0,
            configurations: [],
            assignedUserId: 0,
        });
        setConfigKey('');
        setConfigValue('');
        setSelectedFile(null);
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = (asset: AssetResponse) => {
        setEditAsset(asset);
        setForm({
            name: asset.name,
            description: asset.description || '',
            image: asset.image || '',
            status: asset.status,
            price: asset.price || 0,
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.slice(0, 16) : '',
            categoryId: asset.categoryId,
            locationId: asset.locationId,
            roomId: asset.roomId || 0,
            quantity: asset.quantity || 1,
            warranty: asset.warranty || 0,
            operationYear: asset.operationYear || 0,
            operationStartDate: asset.operationStartDate || '',
            operationTime: asset.operationTime || OperationTime.FULL_DAY,
            lifeSpan: asset.lifeSpan || 0,
            configurations: asset.configurations || [],
            assignedUserId: asset.assignedUserId || 0,
        });
        setConfigKey('');
        setConfigValue('');
        setSelectedFile(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleInputChange = (
        e: SelectChangeEvent<any> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (
            ['categoryId', 'locationId', 'roomId', 'quantity', 'warranty', 'operationYear', 'lifeSpan', 'price', 'assignedUserId'].includes(
                name
            )
        ) {
            const numericValue = Number(value);
            if (numericValue < 0) return;
            setForm((prev) => ({ ...prev, [name]: numericValue }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            try {
                const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
                setForm((prev) => ({ ...prev, image: uploadedUrl }));
                setSelectedFile(e.target.files[0]);
            } catch (error) {
                setError(t('manager_asset.asset.errors.cloudinary'));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddConfiguration = () => {
        if (configKey.trim() && configValue.trim()) {
            setForm((prev) => ({
                ...prev,
                configurations: [...(prev.configurations || []), { specKey: configKey, specValue: configValue }],
            }));
            setConfigKey('');
            setConfigValue('');
        } else {
            setError(t('manager_asset.errors.key_value'));
        }
    };

    const handleRemoveConfiguration = (index: number) => {
        setForm((prev) => ({
            ...prev,
            configurations: (prev.configurations || []).filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setError(t('manager_asset.asset.errors.name'));
            setSuccess(null);
            return;
        }
        if (form.categoryId === 0) {
            setError(t('manager_asset.asset.errors.category'));
            setSuccess(null);
            return;
        }
        if (form.locationId === 0) {
            setError(t('manager_asset.asset.errors.location'));
            setSuccess(null);
            return;
        }
        if (form.roomId === 0) {
            setError(t('manager_asset.asset.errors.room'));
            setSuccess(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const assetToSave: AssetRequest = {
                ...form,
                purchaseDate: form.purchaseDate ? form.purchaseDate : undefined,
            };

            if (editAsset) {
                await putUpdateAssetById(editAsset.id, assetToSave);
                setSuccess(t('manager_asset.asset.success.update'));
            } else {
                await postCreateAsset(assetToSave);
                setSuccess(t('manager_asset.asset.success.create'));
            }
            await fetchData(page, rowsPerPage, keyword, roomFilter, statusFilter, categoryFilter, sortModel);
            handleCloseDialog();
        } catch (err) {
            setError(err.message || t('manager_asset.asset.errors.unexpected'));
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
                await deleteAssetById(deleteId);
                setSuccess(t('manager_asset.asset.success.delete'));
                await fetchData(page, rowsPerPage, keyword, roomFilter, statusFilter, categoryFilter, sortModel);
            } catch (err) {
                setError(err.message || t('manager_asset.asset.errors.unexpected'));
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const handleDuplicate = async (asset: AssetResponse) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const duplicated = await postDuplicatedAsset(asset.id);
            setSuccess(t('manager_asset.asset.success.duplicate'));

            setData((prevData) => {
                const index = prevData.findIndex((a) => a.id === asset.id);
                if (index === -1) {
                    fetchData(page, rowsPerPage, keyword, roomFilter, statusFilter, categoryFilter, sortModel);
                    return prevData;
                }

                const updated = [...prevData];
                updated.splice(index + 1, 0, duplicated);
                return updated.slice(0, rowsPerPage);
            });

            setTotalElements((prev) => prev + 1);
        } catch (err) {
            setError(err.message || t('manager_asset.asset.errors.unexpected'));
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (asset: AssetResponse) => {
        setSelectedAsset(asset);
        setOpenDetailsDialog(true);
    };

    const handleCloseDetails = () => {
        setOpenDetailsDialog(false);
        setSelectedAsset(null);
    };

    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };


    const columns: GridColDef<AssetResponse>[] = [
        {
            field: 'id',
            headerName: 'No.',
            width: isMobile ? 50 : 70,
            valueGetter: ((value, row) => {
                if (!row || !row.id) return '-';
                const index = data.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            }) as GridValueGetter<AssetResponse>,
            sortable: true,
            filterable: false,
            resizable: false,
        },
        {
            field: 'name',
            headerName: t('manager_asset.asset.name'),
            width: isMobile ? 100 : 120,
            sortable: true,
            cellClassName: 'clickable-cell',
        },
        {
            field: 'description',
            headerName: t('manager_asset.asset.description'),
            width: isMobile ? 150 : 250,
            sortable: false,
        },
        {
            field: 'image',
            headerName: t('manager_asset.asset.image'),
            width: isMobile ? 80 : 120,
            sortable: false,
            filterable: false,
            resizable: false,
            renderCell: (params: GridRenderCellParams<AssetResponse, string>) => (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    {params.value ? (
                        <Avatar
                            src={params.value}
                            alt={params.row.name || 'Asset'}
                            sx={{
                                width: isMobile ? 40 : 60,
                                height: isMobile ? 40 : 60,
                                borderRadius: 1,
                                img: {
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                },
                            }}
                        />
                    ) : (
                        'N/A'
                    )}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: isMobile ? 100 : 160,
            sortable: true,
            resizable: false,
            renderCell: (params: GridRenderCellParams<AssetResponse, Status>) => {
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
                        sx={{ width: isMobile ? '60px' : '70px', fontWeight: 200, borderRadius: '20px', justifyContent: 'center' }}
                    />
                );
            },
        },
        {
            field: 'purchaseDate',
            headerName: t('manager_asset.asset.purchase_date'),
            width: isMobile ? 120 : 150,
            sortable: true,
            resizable: false,
            valueGetter: ((value) => {
                return value ? format(new Date(value as string), 'dd/MM/yyyy') : 'N/A';
            }) as GridValueGetter<AssetResponse>,
        },
        {
            field: 'quantity',
            headerName: t('manager_asset.asset.quantity'),
            width: isMobile ? 70 : 80,
            sortable: true,
            resizable: false,
            type: 'number',
        },
        {
            field: 'warranty',
            headerName: t('manager_asset.asset.warranty'),
            width: isMobile ? 100 : 150,
            sortable: true,
            resizable: false,
            type: 'number',
        },
        {
            field: 'operationTime',
            headerName: t('manager_asset.asset.operation_time'),
            width: isMobile ? 100 : 150,
            sortable: false,
            resizable: false,
            renderCell: (params: GridRenderCellParams<AssetResponse, string>) => {
                const value = params.value;

                const getLabel = (val: string | undefined) => {
                    switch (val) {
                        case OperationTime.MORNING:
                            return 'Morning';
                        case OperationTime.AFTERNOON:
                            return 'Afternoon';
                        case OperationTime.NIGHT:
                            return 'Night';
                        case OperationTime.FULL_DAY:
                            return 'Full Day';
                        case OperationTime.TWENTY_FOUR_SEVEN:
                            return '24/7';
                        default:
                            return 'N/A';
                    }
                };

                const getColor = (val: string | undefined): 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' => {
                    switch (val) {
                        case OperationTime.MORNING:
                            return 'primary';
                        case OperationTime.AFTERNOON:
                            return 'success';
                        case OperationTime.NIGHT:
                            return 'secondary';
                        case OperationTime.FULL_DAY:
                            return 'warning';
                        case OperationTime.TWENTY_FOUR_SEVEN:
                            return 'error';
                        default:
                            return 'default';
                    }
                };

                return (
                    <Chip
                        label={getLabel(value)}
                        color={getColor(value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: isMobile ? '60px' : '70px', fontWeight: 200, borderRadius: '20px', justifyContent: 'center' }}
                    />
                );
            },
        },
        {
            field: 'lifeSpan',
            headerName: t('manager_asset.asset.life_span'),
            width: isMobile ? 80 : 100,
            sortable: true,
            type: 'number',
            resizable: false,
        },
        {
            field: 'category',
            headerName: t('manager_asset.asset.category'),
            width: isMobile ? 120 : 150,
            sortable: false,
            resizable: false,
            valueGetter: ((value, row) => {
                if (!row || row.categoryId === undefined || row.categoryId === null) {
                    return 'N/A';
                }
                return categories.find((cat) => cat.id === row.categoryId)?.name || 'N/A';
            }) as GridValueGetter<AssetResponse>,
        },
        {
            field: 'location',
            headerName: t('manager_asset.asset.location'),
            width: isMobile ? 120 : 150,
            sortable: false,
            resizable: false,
            valueGetter: ((value, row) => {
                if (!row || row.locationId === undefined || row.locationId === null) {
                    return 'N/A';
                }
                return locations.find((loc) => loc.id === row.locationId)?.name || 'N/A';
            }) as GridValueGetter<AssetResponse>,
        },
        {
            field: 'room',
            headerName: t('manager_asset.asset.room'),
            width: isMobile ? 100 : 150,
            sortable: false,
            resizable: false,
            valueGetter: ((value, row) => {
                if (!row || row.roomId === undefined || row.roomId === null) {
                    return 'N/A';
                }
                return rooms.find((room) => room.id === row.roomId)?.name || 'N/A';
            }) as GridValueGetter<AssetResponse>,
        },
        {
            field: 'price',
            headerName: t('manager_asset.asset.price'),
            width: isMobile ? 100 : 120,
            sortable: true,
            type: 'number',
            resizable: false,
            valueFormatter: (value?: number) => {
                if (!value || typeof value !== 'number') {
                    return value;
                }
                return `${value.toLocaleString('vi-VN')}`;
            },
        },
        {
            field: 'wearLevel',
            headerName: 'WearLevel',
            renderCell: renderProgress,
            width: isMobile ? 120 : 160,
            type: 'number',
            valueGetter: ((value, row) => {
                if (!row) {
                    return 0;
                }

                const { lifeSpan, operationStartDate, warranty } = row;

                if (!lifeSpan || !operationStartDate) {
                    return 0;
                }

                const startDate = new Date(operationStartDate);
                const currentDate = new Date();
                const operationTimeMs = currentDate.getTime() - startDate.getTime();
                const operationYears = operationTimeMs / (1000 * 60 * 60 * 24 * 365);
                let wearPercentage = (operationYears / lifeSpan) * 100;

                if (warranty && operationYears < warranty / 12) {
                    wearPercentage *= 0.5;
                }

                return Math.min(Math.max(wearPercentage, 0), 100);
            }) as GridValueGetter<AssetResponse>
        },
        {
            field: 'assignedUser',
            headerName: t('manager_asset.asset.assigned_user'),
            width: isMobile ? 120 : 150,
            sortable: false,
            resizable: false,
            valueGetter: ((value, row) => {
                if (!row) return 'Unassigned';
                return row.assignedUserName || row.assignedUserId || 'Unassigned';
            }) as GridValueGetter<AssetResponse>,
        },
        {
            field: 'actions',
            resizable: false,
            headerName: t('manager_asset.asset.actions'),
            width: isMobile ? 100 : 150,
            renderCell: (params: GridRenderCellParams<AssetResponse>) => (
                <>
                    <IconButton onClick={(e) => handleMenuClick(e, params.row.id)} sx={{ padding: isMobile ? 0.5 : 1 }}>
                        <MoreVertIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedRowId === params.row.id}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() => {
                                handleOpenDialogEdit(params.row);
                                handleMenuClose();
                            }}
                        >
                            <EditIcon fontSize="medium" sx={{ mr: 1, color: 'primary.main' }} /> {'Edit'}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleDeleteClick(params.row.id);
                                handleMenuClose();
                            }}
                        >
                            <DeleteIcon fontSize="medium" sx={{ mr: 1, color: 'error.main' }} /> {t('manager_asset.asset.button_delete')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleDuplicate(params.row);
                                handleMenuClose();
                            }}
                        >
                            <ContentCopyIcon fontSize="medium" sx={{ mr: 1, color: 'secondary.main' }} /> {'Duplicate'}
                        </MenuItem>
                    </Menu>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" mb={3}>
                {t('manager_asset.asset.title')}
            </Typography>
            <Box display="flex" gap={2} mb={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialogCreate}
                    sx={{ width: { xs: '100%', sm: 'auto' }, py: 1 }}
                >
                    {t('manager_asset.asset.button_create')}
                </Button>
            </Box>
            <CustomAlert open={!!error} message={error || ''} severity="error" onClose={handleCloseError} />
            <CustomAlert open={!!success} message={success || ''} severity="success" onClose={handleCloseSuccess} />

            <Box mt={3}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            label={t('manager_asset.asset.button_search')}
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            variant="outlined"
                            fullWidth
                            placeholder={t('manager_asset.asset.search_placeholder')}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 10 },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 1,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { xs: '100%', sm: 200 } }}
                            >
                                <InputLabel>{t('manager_asset.asset.button_filter')}</InputLabel>
                                <Select
                                    value={roomFilter}
                                    onChange={(e) => {
                                        setRoomFilter(e.target.value as string);
                                        setPage(0);
                                    }}
                                    label={t('manager_asset.asset.button_filter')}
                                    sx={{ borderRadius: 10 }}
                                >
                                    <MenuItem value="">
                                        <em>{t('manager_asset.asset.room')}</em>
                                    </MenuItem>
                                    {rooms.map((room) => (
                                        <MenuItem key={room.id} value={room.name}>
                                            {room.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ minWidth: { xs: '100%', sm: 160 }, maxWidth: { xs: '100%', sm: 200 } }}
                            >
                                <InputLabel>Status</InputLabel>
                                <Select
                                    multiple
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    label="Status"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={statusOptions.find((opt) => opt.value === value)?.label}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    sx={{ borderRadius: 10 }}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            <Checkbox checked={statusFilter.indexOf(option.value) > -1} />
                                            <ListItemText primary={option.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ minWidth: { xs: '100%', sm: 160 }, maxWidth: { xs: '100%', sm: 200 } }}
                            >
                                <InputLabel>Category</InputLabel>
                                <Select
                                    multiple
                                    value={categoryFilter}
                                    onChange={handleCategoryFilterChange}
                                    label="Category"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={categories.find((cat) => cat.id === value)?.name}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    sx={{ borderRadius: 10 }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            <Checkbox checked={categoryFilter.indexOf(category.id) > -1} />
                                            <ListItemText primary={category.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 3, height: { xs: 'auto', md: '1000px' } }}>
                <DataGrid
                    autosizeOptions={{
                        columns: ['name', 'description'],
                        includeOutliers: true,
                        includeHeaders: false,
                    }}
                    rows={data || []}
                    columnHeaderHeight={isMobile ? 48 : 56}
                    columns={columns.map((col) => ({
                        ...col,
                        align: 'center',
                        headerAlign: 'center',
                        width: col.width || (isMobile ? 100 : 150),
                    }))}
                    pageSizeOptions={[5, 10, 25]}
                    rowHeight={isMobile ? 70 : 86}
                    paginationMode="server"
                    sortingMode="server"
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    rowCount={totalElements}
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setRowsPerPage(newModel.pageSize);
                    }}
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
                    onCellClick={(params: GridCellParams) => {
                        if (params.field === 'name') {
                            handleOpenDetails(params.row as AssetResponse);
                        }
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '0.85rem' : '0.95rem',
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: isMobile ? '0.8rem' : '0.9rem',
                        },
                        '--DataGrid-overlayHeight': '300px',
                        overflowX: 'auto',
                    }}
                />
            </Box>

            {/* Dialog Create/Update */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth={isMobile ? 'xs' : 'lg'}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        margin: { xs: 2, sm: 4 },
                        maxHeight: { xs: '90vh', sm: '80vh' },
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                    {editAsset ? t('manager_asset.asset.update_title') : t('manager_asset.asset.create_title')}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label={t('manager_asset.asset.name')}
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                required
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <TextField
                                label={t('manager_asset.asset.description')}
                                name="description"
                                value={form.description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={isMobile ? 2 : 3}
                                sx={{ mt: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <TextField
                                label={t('manager_asset.asset.purchase_date')}
                                name="purchaseDate"
                                type="datetime-local"
                                value={form.purchaseDate}
                                onChange={handleInputChange}
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                sx={{ mt: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>{t('manager_asset.asset.status')}</InputLabel>
                                <Select
                                    name="status"
                                    value={form.status}
                                    onChange={handleInputChange}
                                    label={t('manager_asset.asset.status')}
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    {Object.values(Status).map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label={t('manager_asset.asset.quantity')}
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                onChange={handleInputChange}
                                fullWidth
                                slotProps={{
                                    htmlInput: { min: 1 },
                                }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <TextField
                                label={t('manager_asset.asset.warranty')}
                                name="warranty"
                                type="number"
                                value={form.warranty}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mt: 2 }}
                                slotProps={{
                                    htmlInput: { min: 0 },
                                }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <TextField
                                label={t('manager_asset.asset.operation_year')}
                                name="operationYear"
                                type="number"
                                value={form.operationYear}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mt: 2 }}
                                slotProps={{
                                    htmlInput: { min: 0 },
                                }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <TextField
                                label={t('manager_asset.asset.operation_start_date')}
                                name="operationStartDate"
                                type="date"
                                value={form.operationStartDate}
                                onChange={handleInputChange}
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                sx={{ mt: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>{t('manager_asset.asset.operation_time')}</InputLabel>
                                <Select
                                    name="operationTime"
                                    value={form.operationTime}
                                    onChange={handleInputChange}
                                    label={t('manager_asset.asset.operation_time')}
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    {Object.values(OperationTime).map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label={t('manager_asset.asset.life_span')}
                                name="lifeSpan"
                                type="number"
                                value={form.lifeSpan}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mt: 2 }}
                                slotProps={{
                                    htmlInput: { min: 0 },
                                }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                            <TextField
                                label={t('manager_asset.asset.price')}
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleInputChange}
                                fullWidth
                                sx={{ mt: 2 }}
                                slotProps={{
                                    htmlInput: { min: 0 },
                                }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>{t('manager_asset.asset.category')}</InputLabel>
                                <Select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleInputChange}
                                    label={t('manager_asset.asset.category')}
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    <MenuItem value={0}>
                                        <em>Select Category</em>
                                    </MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>{t('manager_asset.asset.location')}</InputLabel>
                                <Select
                                    name="locationId"
                                    value={form.locationId}
                                    onChange={handleInputChange}
                                    label={t('manager_asset.asset.location')}
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    <MenuItem value={0}>
                                        <em>Select Location</em>
                                    </MenuItem>
                                    {locations.map((loc) => (
                                        <MenuItem key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>{t('manager_asset.asset.room')}</InputLabel>
                                <Select
                                    name="roomId"
                                    value={form.roomId}
                                    onChange={handleInputChange}
                                    label={t('manager_asset.asset.room')}
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    <MenuItem value={0}>
                                        <em>Select Room</em>
                                    </MenuItem>
                                    {rooms.map((room) => (
                                        <MenuItem key={room.id} value={room.id}>
                                            {room.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ mt: 2 }}>
                                <UserSelect
                                    assignedUserId={form.assignedUserId}
                                    setAssignedUserId={(id) =>
                                        setForm((prev) => ({ ...prev, assignedUserId: id || 0 }))
                                    }
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                                    {t('manager_asset.asset.configurations')}
                                </Typography>
                                {(form.configurations || []).map((config, index) => (
                                    <Grid container spacing={1} key={index} sx={{ mb: 2, mt: 3 }}>
                                        <Grid size={{ xs: 12, sm: 5 }}>
                                            <TextField
                                                label={t('manager_asset.asset.spec_key')}
                                                value={config.specKey}
                                                onChange={(e) => {
                                                    const newConfigs = [...(form.configurations || [])];
                                                    newConfigs[index] = {
                                                        ...newConfigs[index],
                                                        specKey: e.target.value,
                                                    };
                                                    setForm((prev) => ({ ...prev, configurations: newConfigs }));
                                                }}
                                                fullWidth
                                                size={isMobile ? 'small' : 'medium'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 5 }}>
                                            <TextField
                                                label={t('manager_asset.asset.spec_value')}
                                                value={config.specValue}
                                                onChange={(e) => {
                                                    const newConfigs = [...(form.configurations || [])];
                                                    newConfigs[index] = {
                                                        ...newConfigs[index],
                                                        specValue: e.target.value,
                                                    };
                                                    setForm((prev) => ({ ...prev, configurations: newConfigs }));
                                                }}
                                                fullWidth
                                                size={isMobile ? 'small' : 'medium'}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 2 }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleRemoveConfiguration(index)}
                                                fullWidth
                                                sx={{mt:0.5}}
                                                size={isMobile ? 'small' : 'medium'}
                                            >
                                                {t('manager_asset.asset.button_delete')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <TextField
                                            label={t('manager_asset.asset.spec_key')}
                                            value={configKey}
                                            onChange={(e) => setConfigKey(e.target.value)}
                                            fullWidth
                                            size={isMobile ? 'small' : 'medium'}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <TextField
                                            label={t('manager_asset.asset.spec_value')}
                                            value={configValue}
                                            onChange={(e) => setConfigValue(e.target.value)}
                                            fullWidth
                                            size={isMobile ? 'small' : 'medium'}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            sx={{mt:0.5}}
                                            onClick={handleAddConfiguration}
                                            fullWidth
                                            size={isMobile ? 'small' : 'medium'}
                                        >
                                            {t('manager_asset.asset.button_add')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                                sx={{ mt: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            >
                                {t('manager_asset.asset.button_upload')}
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                            {form.image && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={form.image}
                                        alt={form.name}
                                        style={{
                                            maxWidth: '100%',
                                            borderRadius: '12px',
                                            height: isMobile ? '150px' : 'auto',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        {t('manager_asset.asset.button_cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        {t('manager_asset.asset.button_save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Delete Confirmation */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth={isMobile ? 'xs' : 'lg'}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        margin: { xs: 2, sm: 4 },
                        maxHeight: { xs: '90vh', sm: '80vh' },
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                    {t('manager_asset.asset.dialog_title')}
                </DialogTitle>
                <DialogContent>
                    <Typography>{t('manager_asset.asset.dialog_content')}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        {t('manager_asset.asset.button_cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        {t('manager_asset.asset.button_delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Details */}
            <Dialog
                open={openDetailsDialog}
                onClose={handleCloseDetails}
                maxWidth={isMobile ? 'xs' : 'md'}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        margin: { xs: 2, sm: 4 },
                        maxHeight: { xs: '90vh', sm: '80vh' },
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: 'grey.50',
                        borderBottom: theme => `1px solid ${theme.palette.divider}`,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                    }}
                >
                    Asset Details
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
                    {selectedAsset && (
                        <Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.name')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedAsset.name}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.description')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedAsset.description || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.status')}:
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: selectedAsset.status === Status.AVAILABLE ? 'success.main' : 'error.main',
                                                fontWeight: 'medium',
                                                fontSize: isMobile ? '0.85rem' : '0.9rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {selectedAsset.status}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.purchase_date')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {selectedAsset.purchaseDate
                                                ? format(new Date(selectedAsset.purchaseDate), 'dd/MM/yyyy HH:mm:ss')
                                                : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.quantity')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {selectedAsset.quantity || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.price')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {selectedAsset.price || 0} VND
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.warranty')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedAsset.warranty || 'N/A'} {selectedAsset.warranty ? 'months' : ''}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.operation_year')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {selectedAsset.operationYear || 'N/A'} {selectedAsset.operationYear ? '' : ''}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.operation_time')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {selectedAsset.operationTime || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.life_span')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {selectedAsset.lifeSpan || 'N/A'} {selectedAsset.lifeSpan ? 'years' : ''}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.category')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {categories.find((cat) => cat.id === selectedAsset.categoryId)?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.location')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {locations.find((loc) => loc.id === selectedAsset.locationId)?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.room')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0, }}>
                                            {rooms.find((room) => room.id === selectedAsset.roomId)?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                minWidth: { xs: 100, md: 150 },
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                fontSize: isMobile ? '0.9rem' : '1rem',
                                                marginRight: isMobile ?'10px' :0,
                                            }}
                                        >
                                            {t('manager_asset.asset.assigned_user')}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: isMobile ? '0.85rem' : '0.9rem',marginRight: isMobile ?'10px' :0 }}>
                                            {selectedAsset.assignedUserName || selectedAsset.assignedUserId || 'Unassigned'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {selectedAsset.configurations && selectedAsset.configurations.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 'bold',
                                            color: 'text.primary',
                                            fontSize: isMobile ? '1rem' : '1.25rem',
                                        }}
                                    >
                                        {t('manager_asset.asset.configurations')}:
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <Table size={isMobile ? 'small' : 'medium'}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'primary.main' }}>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        {t('manager_asset.asset.spec_key')}
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        {t('manager_asset.asset.spec_value')}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedAsset.configurations.map((config, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                                                            '&:hover': { bgcolor: 'primary.light' },
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{config.specKey}</TableCell>
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{config.specValue}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                            {selectedAsset.image && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 'bold',
                                            color: 'text.primary', // Thay '#424242'
                                            fontSize: isMobile ? '1rem' : '1.25rem',
                                        }}
                                    >
                                        {t('manager_asset.asset.image')}:
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={selectedAsset.image}
                                        alt={selectedAsset.name}
                                        sx={{
                                            maxWidth: '100%',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.02)' },
                                            height: isMobile ? '150px' : 'auto',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseDetails}
                        variant="outlined"
                        sx={{ borderRadius: '20px', textTransform: 'none', px: 3 }}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Asset;