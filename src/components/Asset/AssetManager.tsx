import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../state/store.ts';
import {
    postAssignAssetToUser,
    postUnassignAsset,
    fetchAssetsByUserId,
    fetchAssetHistoriesByAssetId,
    AssetHistoryResponse, fetchAssets, AssetSpecificResponse,
} from '../../api/asset/assetApi.ts';
import UserSelect from './UserSelect';

import debounce from 'lodash.debounce';
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import { getUsers } from '../../state/Admin/Reducer.ts';
import AssetSelect from './AssetSelect.tsx';



const AssetManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.admin);

    // State for assigning assets
    const [assignAssetId, setAssignAssetId] = useState<number | null>(null);
    const [assignUserId, setAssignUserId] = useState<number | null>(null);
    const [assignLoading, setAssignLoading] = useState<boolean>(false);
    const [assignError, setAssignError] = useState<string | null>(null);
    const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

    // State for unassigning assets
    const [unassignAssetId, setUnassignAssetId] = useState<number | null>(null);
    const [unassignLoading, setUnassignLoading] = useState<boolean>(false);
    const [unassignError, setUnassignError] = useState<string | null>(null);
    const [unassignSuccess, setUnassignSuccess] = useState<string | null>(null);

    // State for fetching assets by user
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userAssets, setUserAssets] = useState<AssetSpecificResponse[]>([]);
    const [userAssetsLoading, setUserAssetsLoading] = useState<boolean>(false);
    const [userAssetsError, setUserAssetsError] = useState<string | null>(null);
    const [userAssetsTotal, setUserAssetsTotal] = useState<number>(0);
    const [userAssetsPage, setUserAssetsPage] = useState<number>(0);
    const [userAssetsRowsPerPage, setUserAssetsRowsPerPage] = useState<number>(10);

    // State for fetching asset histories
    const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
    const [assetHistories, setAssetHistories] = useState<AssetHistoryResponse[]>([]);
    const [assetHistoriesLoading, setAssetHistoriesLoading] = useState<boolean>(false);
    const [assetHistoriesError, setAssetHistoriesError] = useState<string | null>(null);
    const [assetHistoriesTotal, setAssetHistoriesTotal] = useState<number>(0);
    const [assetHistoriesPage, setAssetHistoriesPage] = useState<number>(0);
    const [assetHistoriesRowsPerPage, setAssetHistoriesRowsPerPage] = useState<number>(10);

    // Fetch all users and assets when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users
                await dispatch(getUsers({ page: 0, size: 100, keyword: '', role: '' })).unwrap();
                // Fetch Assets
                await fetchAssets(0,20,'','' );
            } catch (error) {
                // Errors are handled in Redux state
            }
        };

        fetchData();
    }, [dispatch]);

    // Handlers for Assign Asset
    const handleAssignAsset = async () => {
        if (assignAssetId === null || assignUserId === null) {
            setAssignError('Please select both asset and user.');
            return;
        }
        try {
            setAssignLoading(true);
            const response = await postAssignAssetToUser(assignAssetId, assignUserId);
            setAssignSuccess(`Asset "${response.name}" assigned to user successfully.`);
            // Reset selections
            setAssignAssetId(null);
            setAssignUserId(null);
            // Optionally, refresh user assets if applicable
            if (selectedUserId === assignUserId) {
                await fetchUserAssets(selectedUserId, userAssetsPage, userAssetsRowsPerPage);
            }
        } catch (error: any) {
            setAssignError(error?.response?.data?.error || error.error || 'Failed to assign asset.');
        } finally {
            setAssignLoading(false);
        }
    };

    // Handlers for Unassign Asset
    const handleUnassignAsset = async () => {
        if (unassignAssetId === null) {
            setUnassignError('Please select an asset to unassign.');
            return;
        }
        try {
            setUnassignLoading(true);
            const response = await postUnassignAsset(unassignAssetId);
            setUnassignSuccess(`Asset "${response.name}" unassigned successfully.`);
            // Reset selection
            setUnassignAssetId(null);
            // Optionally, refresh user assets if applicable
            if (selectedUserId !== null) {
                await fetchUserAssets(selectedUserId, userAssetsPage, userAssetsRowsPerPage);
            }
        } catch (error: any) {
            setUnassignError(error.error || 'Failed to unassign asset.');
        } finally {
            setUnassignLoading(false);
        }
    };

    // Handlers for Fetching User's Assets
    const fetchUserAssets = async (userId: number, page: number, size: number) => {
        try {
            setUserAssetsLoading(true);
            const response = await fetchAssetsByUserId(userId, page, size);
            setUserAssets(response.content);
            setUserAssetsTotal(response.totalElements);
            setUserAssetsError(null);
        } catch (error: any) {
            setUserAssetsError(error.error || 'Failed to fetch user assets.');
        } finally {
            setUserAssetsLoading(false);
        }
    };

    // Debounced version of fetchUserAssets
    const debouncedFetchUserAssets = useMemo(
        () =>
            debounce((userId: number, page: number, size: number) => {
                fetchUserAssets(userId, page, size);
            }, 500),
        []
    );

    useEffect(() => {
        if (selectedUserId !== null) {
            debouncedFetchUserAssets(selectedUserId, userAssetsPage, userAssetsRowsPerPage);
        } else {
            setUserAssets([]);
            setUserAssetsTotal(0);
        }
        return () => {
            debouncedFetchUserAssets.cancel();
        };
    }, [selectedUserId, userAssetsPage, userAssetsRowsPerPage, debouncedFetchUserAssets]);

    // Handlers for Fetching Asset Histories
    const fetchAssetHistories = async (assetId: number, page: number, size: number) => {
        try {
            setAssetHistoriesLoading(true);
            const response = await fetchAssetHistoriesByAssetId(assetId, page, size);
            setAssetHistories(response.content);
            setAssetHistoriesTotal(response.totalElements);
            setAssetHistoriesError(null);
        } catch (error: any) {
            setAssetHistoriesError(error.error || 'Failed to fetch asset histories.');
        } finally {
            setAssetHistoriesLoading(false);
        }
    };

    // Debounced version of fetchAssetHistories
    const debouncedFetchAssetHistories = useMemo(
        () =>
            debounce((assetId: number, page: number, size: number) => {
                fetchAssetHistories(assetId, page, size);
            }, 500),
        []
    );

    useEffect(() => {
        if (selectedAssetId !== null) {
            debouncedFetchAssetHistories(selectedAssetId, assetHistoriesPage, assetHistoriesRowsPerPage);
        } else {
            setAssetHistories([]);
            setAssetHistoriesTotal(0);
        }
        return () => {
            debouncedFetchAssetHistories.cancel();
        };
    }, [selectedAssetId, assetHistoriesPage, assetHistoriesRowsPerPage, debouncedFetchAssetHistories]);

    // Handlers for Pagination
    const handleUserAssetsPageChange = (_event: unknown, newPage: number) => {
        setUserAssetsPage(newPage);
    };

    const handleUserAssetsRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserAssetsRowsPerPage(parseInt(event.target.value, 10));
        setUserAssetsPage(0);
    };

    const handleAssetHistoriesPageChange = (_event: unknown, newPage: number) => {
        setAssetHistoriesPage(newPage);
    };

    const handleAssetHistoriesRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAssetHistoriesRowsPerPage(parseInt(event.target.value, 10));
        setAssetHistoriesPage(0);
    };

    // Handler to unassign asset directly from the table
    const handleUnassignAssetFromTable = async (assetId: number) => {
        if (window.confirm("Are you sure you want to unassign this asset?")) {
            try {
                setUnassignLoading(true);
                const response = await postUnassignAsset(assetId);
                setUnassignSuccess(`Asset "${response.name}" unassigned successfully.`);
                // Refresh user assets if applicable
                if (selectedUserId !== null) {
                    await fetchUserAssets(selectedUserId, userAssetsPage, userAssetsRowsPerPage);
                }
            } catch (error: any) {
                setUnassignError(error.error || 'Failed to unassign asset.');
            } finally {
                setUnassignLoading(false);
            }
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Asset Management
            </Typography>

            {/* Loading Indicator */}
            <LoadingIndicator open={assignLoading || unassignLoading || userAssetsLoading || assetHistoriesLoading } />

            {/* Error Alert */}

            <CustomAlert
                open={
                    !!assignError ||
                    !!unassignError ||
                    !!userAssetsError ||
                    !!assetHistoriesError
                }
                message={
                    assignError ||
                    unassignError ||
                    userAssetsError ||
                    assetHistoriesError ||
                    ''
                }
                severity="error" // Luôn màu đỏ
                onClose={() => {
                    setAssignError(null);
                    setUnassignError(null);
                    setUserAssetsError(null);
                    setAssetHistoriesError(null);
                }}
            />


            {/* Success Snackbar */}
            <CustomAlert
                open={!!assignSuccess || !!unassignSuccess}
                message={assignSuccess || unassignSuccess || ''}
                severity="success"
                onClose={() => {
                    setAssignSuccess(null);
                    setUnassignSuccess(null);
                }}
            />


            {/* Section: Assign Asset */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h6" gutterBottom>
                    Assign Asset to User
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <AssetSelect
                            selectedAssetId={assignAssetId}
                            setSelectedAssetId={setAssignAssetId}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <UserSelect
                            assignedUserId={assignUserId}
                            setAssignedUserId={setAssignUserId}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAssignAsset}
                            disabled={assignLoading }
                            fullWidth
                        >
                            {assignLoading ? <CircularProgress size={24} /> : 'Assign Asset'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Section: Unassign Asset */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h6" gutterBottom>
                    Unassign Asset
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <AssetSelect
                            selectedAssetId={unassignAssetId}
                            setSelectedAssetId={setUnassignAssetId}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}></Grid> {/* Empty grid for alignment */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleUnassignAsset}
                            disabled={unassignLoading }
                            fullWidth
                        >
                            {unassignLoading ? <CircularProgress size={24} /> : 'Unassign Asset'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Section: View Assets by User */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h6" gutterBottom>
                    View Assets by User
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <UserSelect
                        assignedUserId={selectedUserId}
                        setAssignedUserId={setSelectedUserId}
                    />
                </Box>
                {userAssetsLoading ? (
                    <CircularProgress />
                ) : (
                    selectedUserId !== null && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Serial Number</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Purchase Date</TableCell>
                                        <TableCell>Price (VND)</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userAssets.length > 0 ? (
                                        userAssets.map((asset) => (
                                            <TableRow key={asset.id} hover>
                                                <TableCell>{asset.id}</TableCell>
                                                <TableCell>{asset.name}</TableCell>
                                                <TableCell>{asset.description}</TableCell>
                                                <TableCell>{asset.serialNumber}</TableCell>
                                                <TableCell>{asset.status}</TableCell>
                                                <TableCell>{new Date(asset.purchaseDate).toLocaleString()}</TableCell>
                                                <TableCell>{asset.price.toLocaleString()}</TableCell>
                                                <TableCell>{asset.categoryName}</TableCell>
                                                <TableCell>{asset.locationName}</TableCell>
                                                <TableCell sx={{width:'10%'}}>
                                                    <IconButton
                                                        sx={{ color: 'primary.main' }}
                                                        size="small"
                                                        onClick={() => setSelectedAssetId(asset.id)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{ color: 'error.main' }}
                                                        size="small"
                                                        onClick={() => handleUnassignAssetFromTable(asset.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center">
                                                No assets found for this user.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={userAssetsTotal}
                                page={userAssetsPage}
                                onPageChange={handleUserAssetsPageChange}
                                rowsPerPage={userAssetsRowsPerPage}
                                onRowsPerPageChange={handleUserAssetsRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </TableContainer>
                    )
                )}
            </Box>

            {/* Section: View Asset Histories */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h6" gutterBottom>
                    View Asset Histories
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <AssetSelect
                        selectedAssetId={selectedAssetId}
                        setSelectedAssetId={setSelectedAssetId}
                    />
                </Box>
                {assetHistoriesLoading ? (
                    <CircularProgress />
                ) : (
                    selectedAssetId !== null && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Asset ID</TableCell>
                                        <TableCell>User Name</TableCell>
                                        <TableCell>Previous Status</TableCell>
                                        <TableCell>New Status</TableCell>
                                        <TableCell>Change Date</TableCell>
                                        <TableCell>Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assetHistories.length > 0 ? (
                                        assetHistories.map((history, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{history.assetId}</TableCell>
                                                <TableCell>
                                                    {user.find(u => u.id === history.userId)?.firstName +
                                                        ' ' +
                                                        user.find(u => u.id === history.userId)?.lastName ||
                                                        'N/A'}
                                                </TableCell>
                                                <TableCell>{history.previousStatus}</TableCell>
                                                <TableCell>{history.newStatus}</TableCell>
                                                <TableCell>{new Date(history.changeDate).toLocaleString()}</TableCell>
                                                <TableCell>{history.remarks}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No histories found for this asset.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={assetHistoriesTotal}
                                page={assetHistoriesPage}
                                onPageChange={handleAssetHistoriesPageChange}
                                rowsPerPage={assetHistoriesRowsPerPage}
                                onRowsPerPageChange={handleAssetHistoriesRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </TableContainer>
                    )
                )}
            </Box>
        </Box>
    );

};

export default AssetManager;
