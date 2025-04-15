import React, { useEffect, useMemo, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
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
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridSortModel,
    GridToolbar,
    GridValueGetter
} from '@mui/x-data-grid';
import { useSelector, useDispatch } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplyIcon from "@mui/icons-material/Reply";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";
import debounce from 'lodash.debounce';
import { RootState, AppDispatch } from "../../state/store.ts";
import {
    AssetBorrowing,
    AssetResponse,
    BorrowingStatus,
    fetchAssetBorrowings,
    fetchAssets,
    postBorrowing,
    postCheckOverDue,
    putApproveBorrow,
    putReturnAsset
} from "../../api/asset/assetApi.ts";
import { CustomNoRowsOverlay } from "../../utils/CustomNoRowsOverlay.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import { getUsers } from "../../state/Admin/Reducer.ts";
import { User } from "../../state/Authentication/Action.ts";
import { unwrapResult } from "@reduxjs/toolkit";

// Utility function to extract sortBy and sortOrder from sortModel
const getSortParams = (sortModel: GridSortModel, defaultSortBy: string = "id", defaultSortOrder: string = "asc") => {
    const sortBy = sortModel.length > 0 ? sortModel[0].field : defaultSortBy;
    const sortOrder = sortModel.length > 0 && sortModel[0].sort ? sortModel[0].sort : defaultSortOrder;
    return { sortBy, sortOrder };
};

const AssetBorrowingManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { user } = useSelector((state: RootState) => state.admin);

    const [borrowings, setBorrowings] = useState<AssetBorrowing[]>([]);
    const [assets, setAssets] = useState<AssetResponse[]>([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedBorrowing, setSelectedBorrowing] = useState<AssetBorrowing | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortModel, setSortModel] = React.useState<GridSortModel>([]);

    const [formData, setFormData] = useState<AssetBorrowing>({
        assetId: 0,
        userId: 0,
        username: "",
        assetName: "",
        borrowDate: new Date().toISOString(),
        returnDate: "",
        expectedReturnDate: "",
        status: BorrowingStatus.PENDING,
        remarks: "",
    });

    const [assetSearch, setAssetSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [filteredAssets, setFilteredAssets] = useState<AssetResponse[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [assetPage, setAssetPage] = useState(0);
    const [userPage, setUserPage] = useState(0);
    const [hasMoreAssets, setHasMoreAssets] = useState(true);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);

    const isAdmin = currentUser?.role === "ADMIN";

    const fetchBorrowings = useMemo(
        () =>
            debounce(
                async (
                    currentPage: number,
                    currentRowsPerPage: number,
                    currentKeyword: string,
                    currentStatus: string,
                    currentSortBy?: string,
                    currentSortOrder?: string
                ) => {
                    setIsLoading(true);
                    try {
                        const response = await fetchAssetBorrowings(
                            currentPage,
                            currentRowsPerPage,
                            currentKeyword,
                            currentStatus,
                            currentSortBy,
                            currentSortOrder
                        );
                        setBorrowings(response.content);
                        setTotalElements(response.totalElements);
                        setError(null);
                    } catch (err) {
                        setError(err.message || "Failed to fetch borrowings.");
                        setSuccess(null);
                    } finally {
                        setIsLoading(false);
                    }
                },
                300
            ),
        []
    );

    const fetchAllAssets = async (
        searchKeyword: string = "",
        pageNum: number = 0,
        append: boolean = false
    ) => {
        setIsLoading(true);
        try {
            const size = 20;
            const response = await fetchAssets(
                pageNum,
                size,
                searchKeyword,
                "",
                "",
                "",
                "name",
                "asc"
            );
            const newAssets = Array.isArray(response.content) ? response.content : [];
            const uniqueAssets = Array.from(
                new Map([...(append ? filteredAssets : []), ...newAssets].map((asset) => [asset.id, asset])).values()
            );
            if (append) {
                setFilteredAssets(uniqueAssets);
                setAssets((prev) => Array.from(new Map([...prev, ...newAssets].map((asset) => [asset.id, asset])).values()));
            } else {
                setFilteredAssets(uniqueAssets);
                if (!searchKeyword) {
                    setAssets(uniqueAssets);
                }
            }
            setHasMoreAssets(response.totalElements > uniqueAssets.length);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch assets.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async (searchKeyword: string = "", pageNum: number = 0, append: boolean = false) => {
        setIsLoading(true);
        try {
            const size = 20;
            const action = await dispatch(getUsers({
                page: pageNum,
                size,
                keyword: searchKeyword,
                role: ""
            }));
            const result = unwrapResult(action);
            const newUsers = Array.isArray(result.content) ? result.content : [];
            if (append) {
                setFilteredUsers((prev) => [
                    ...new Map([...prev, ...newUsers].map(u => [u.id, u])).values()
                ]);
            } else {
                setFilteredUsers(newUsers);
            }
            setHasMoreUsers(result.totalElements > newUsers.length);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch users.");
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetchAssets = useMemo(
        () => debounce((keyword: string) => {
            setAssetPage(0);
            fetchAllAssets(keyword, 0, false);
        }, 300),
        []
    );
    const debouncedFetchUsers = useMemo(
        () => debounce((keyword: string) => {
            setUserPage(0);
            fetchUsers(keyword, 0);
        }, 300),
        []
    );

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchAllAssets("", 0, false),
                    fetchUsers("", 0, false),
                ]);
            } catch (err) {
                setError(err.message || "Failed to load initial data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
        return () => {
            fetchBorrowings.cancel();
            debouncedFetchAssets.cancel();
            debouncedFetchUsers.cancel();
        };
    }, []);

    useEffect(() => {
        const validSortFields = ["id", "assetName", "username", "status", "borrowDate", "expectedReturnDate", "returnDate"];
        const { sortBy, sortOrder } = getSortParams(sortModel, "id", "asc");
        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "id";
        fetchBorrowings(page, rowsPerPage, keyword, statusFilter, finalSortBy, sortOrder);
    }, [page, rowsPerPage, keyword, statusFilter, sortModel, fetchBorrowings]);

    const handleCreateOpen = () => {
        setFormData({
            assetId: 0,
            userId: 0,
            username: "",
            assetName: "",
            borrowDate: new Date().toISOString(),
            returnDate: "",
            expectedReturnDate: "",
            status: BorrowingStatus.PENDING,
            remarks: "",
        });
        setAssetSearch("");
        setUserSearch("");
        setAssetPage(0);
        setUserPage(0);
        setFilteredUsers(user);
        setFilteredAssets(assets);
        setHasMoreAssets(true);
        setHasMoreUsers(true);
        setOpenCreate(true);
    };

    const handleCreateClose = () => setOpenCreate(false);

    const handleDetailsOpen = (id: number) => {
        const borrowing = borrowings.find((b) => b.id === id);
        if (borrowing) {
            setSelectedBorrowing(borrowing);
            setOpenDetails(true);
        } else {
            setError("Borrowing not found.");
        }
    };

    const handleDetailsClose = () => setOpenDetails(false);

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        const validSortFields = [
            "id",
            "assetName",
            "username",
            "status",
            "borrowDate",
            "expectedReturnDate",
            "returnDate",
        ];

        if (newSortModel.length > 0) {
            const currentField = newSortModel[0].field;
            if (!validSortFields.includes(currentField)) {
                setSortModel([{ field: "id", sort: "asc" }]);
            } else {
                const previousSort = sortModel[0]?.field === currentField ? sortModel[0]?.sort : null;
                const newSort = previousSort === "asc" ? "desc" : "asc";
                setSortModel([{ field: currentField, sort: newSort }]);
            }
        } else {
            setSortModel([{ field: "id", sort: "asc" }]);
        }

        setPage(0);
    };

    const handleSubmit = async () => {
        if (!formData.assetId || !formData.userId || !formData.expectedReturnDate) {
            setError("Please fill in all required fields.");
            return;
        }
        setIsLoading(true);
        try {
            const selectedAsset = filteredAssets.find((a) => a.id === formData.assetId);
            const selectedUser = filteredUsers.find((u) => u.id === formData.userId);
            const submitData = {
                ...formData,
                assetName: selectedAsset?.name || "",
                username: selectedUser?.username || ""
            };
            await postBorrowing(submitData);
            setSuccess("Borrowing request created successfully.");
            setError(null);
            handleCreateClose();
            const { sortBy, sortOrder } = getSortParams(sortModel);
            fetchBorrowings(page, rowsPerPage, keyword, statusFilter, sortBy, sortOrder);
        } catch (err) {
            setError(err.message || "Failed to create borrowing.");
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        setIsLoading(true);
        try {
            await putApproveBorrow(id);
            setSuccess("Borrowing approved successfully.");
            setError(null);
            const { sortBy, sortOrder } = getSortParams(sortModel);
            fetchBorrowings(page, rowsPerPage, keyword, statusFilter, sortBy, sortOrder);
        } catch (err) {
            setError(err.message || "Failed to approve borrowing.");
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturn = async (id: number) => {
        setIsLoading(true);
        try {
            await putReturnAsset(id);
            setSuccess("Asset returned successfully.");
            setError(null);
            const { sortBy, sortOrder } = getSortParams(sortModel);
            fetchBorrowings(page, rowsPerPage, keyword, statusFilter, sortBy, sortOrder);
        } catch (err) {
            setError(err.message || "Failed to return asset.");
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckOverdue = async () => {
        setIsLoading(true);
        try {
            const message = await postCheckOverDue();
            setSuccess(message || "Overdue borrowings checked successfully.");
            setError(null);
            const { sortBy, sortOrder } = getSortParams(sortModel);
            fetchBorrowings(page, rowsPerPage, keyword, statusFilter, sortBy, sortOrder);
        } catch (err) {
            setError(err.message || "Failed to check overdue borrowings.");
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssetLoadMore = () => {
        if (hasMoreAssets && !isLoading) {
            const nextPage = assetPage + 1;
            setAssetPage(nextPage);
            fetchAllAssets(assetSearch, nextPage, true);
        }
    };

    const handleUserLoadMore = () => {
        if (hasMoreUsers && !isLoading) {
            const nextPage = userPage + 1;
            setUserPage(nextPage);
            fetchUsers(userSearch, nextPage, true);
        }
    };

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'id',
            headerName: "No.",
            minWidth: 100,
            flex: 0.5,
            sortable: true,
            filterable: false,
            resizable: false,
            valueGetter: ((value, row) => {
                if (!row || !row.id) return '-';
                const index = borrowings.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            }) as GridValueGetter<AssetResponse>,
        },
        {
            field: 'assetName',
            headerName: "Asset",
            minWidth: 150,
            flex: 1,
            sortable: true,
            filterable: false,
            resizable: true,
            valueGetter: (value, row) => row.assetName || "N/A",
        },
        {
            field: 'username',
            headerName: "User",
            minWidth: 150,
            flex: 1,
            sortable: true,
            filterable: false,
            resizable: false,
            valueGetter: (value, row) => row.username || "N/A",
        },
        {
            field: 'borrowDate',
            headerName: "Borrow Date",
            minWidth: 180,
            flex: 1.5,
            sortable: true,
            filterable: false,
            resizable: false,
            valueGetter: (value) => (value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : "N/A"),
        },
        {
            field: 'expectedReturnDate',
            headerName: "Expected Return Date",
            minWidth: 180,
            flex: 1.5,
            sortable: true,
            filterable: false,
            resizable: false,
            valueGetter: (value) => (value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : "N/A"),
        },
        {
            field: 'returnDate',
            headerName: "Return Date",
            minWidth: 180,
            flex: 1.5,
            sortable: true,
            filterable: false,
            resizable: false,
            valueGetter: (value) => (value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ""),
        },
        {
            field: 'status',
            headerName: "Status",
            minWidth: 120,
            flex: 1,
            sortable: false,
            filterable: false,
            resizable: false,
            renderCell: (params: GridRenderCellParams<AssetBorrowing, BorrowingStatus>) => {
                const status = params.value;

                const getLabel = (val: string | undefined) => {
                    switch (val) {
                        case BorrowingStatus.PENDING:
                            return 'Pending';
                        case BorrowingStatus.APPROVED:
                            return 'Approved';
                        case BorrowingStatus.BORROWED:
                            return 'Borrowed';
                        case BorrowingStatus.RETURNED:
                            return 'Returned';
                        case BorrowingStatus.OVERDUE:
                            return 'Overdue';
                        default:
                            return 'N/A';
                    }
                };

                let chipColor: 'success' | 'primary' | 'warning' | 'default' | 'error' | 'info' = 'default';

                switch (status) {
                    case BorrowingStatus.PENDING:
                        chipColor = 'success';
                        break;
                    case BorrowingStatus.BORROWED:
                        chipColor = 'primary';
                        break;
                    case BorrowingStatus.OVERDUE:
                        chipColor = 'warning';
                        break;
                    case BorrowingStatus.RETURNED:
                        chipColor = 'error';
                        break;
                    case BorrowingStatus.APPROVED:
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
            }
        },
        {
            field: 'remarks',
            headerName: "Remarks",
            minWidth: 200,
            flex: 2,
            valueGetter: (value) => value || "N/A",
        },
        {
            field: 'actions',
            headerName: "Actions",
            minWidth: 150,
            flex: 1.5,
            sortable: false,
            filterable: false,
            renderCell: ({row}) => (
                <>
                    {isAdmin && row.status === BorrowingStatus.PENDING && (
                        <IconButton sx={{color: 'success.main'}} onClick={() => handleApprove(row.id)}>
                            <CheckCircleIcon/>
                        </IconButton>
                    )}
                    {(isAdmin || row.userId === currentUser?.id) && row.status === BorrowingStatus.BORROWED && (
                        <IconButton sx={{color: 'primary.main'}} onClick={() => handleReturn(row.id)}>
                            <ReplyIcon/>
                        </IconButton>
                    )}
                    <IconButton sx={{color: 'info.main'}} onClick={() => handleDetailsOpen(row.id)}>
                        <VisibilityIcon/>
                    </IconButton>
                </>
            ),
        },
    ], [borrowings, page, rowsPerPage, isAdmin, currentUser]);

    return (
        <div className="p-6">
            <Typography variant="h4" className="pb-4">
                Asset Borrowing Management
            </Typography>
            <Box display="flex" gap={2} mb={4}>
                <Button variant="contained" color="primary" onClick={handleCreateOpen}>
                    Create Borrowing
                </Button>
                {isAdmin && (
                    <Button variant="contained" color="secondary" onClick={handleCheckOverdue}>
                        Check Overdue
                    </Button>
                )}
            </Box>

            <Box mb={4}>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <TextField
                            label="Search"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            variant="outlined"
                            fullWidth
                            placeholder="Search borrowings..."
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Filter Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as string);
                                    setPage(0);
                                }}
                                label="Filter Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="BORROWED">Borrowed</MenuItem>
                                <MenuItem value="RETURNED">Returned</MenuItem>
                                <MenuItem value="OVERDUE">Overdue</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

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

            <Box sx={{height: '600px', width: '100%'}}>
                <DataGrid
                    rows={borrowings}
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
                            color: '#1976d2',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                        },
                        '--DataGrid-overlayHeight': '300px',
                    }}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                />
            </Box>

            {/* Dialog tạo yêu cầu mượn */}
            <Dialog open={openCreate} onClose={handleCreateClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create Borrowing</DialogTitle>
                <DialogContent className="space-y-4" sx={{mt: 2}}>
                    <Autocomplete
                        options={filteredAssets}
                        getOptionLabel={(option) => `${option.name ?? ''} - (${option.status ?? 'N/A'}) - ${option.quantity ?? 0}`}
                        getOptionKey={(option) => option.id}
                        filterOptions={(x) => x}
                        onInputChange={(event, value) => {
                            setAssetSearch(value);
                            debouncedFetchAssets(value);
                        }}
                        onChange={(event, value) => {
                            setFormData((prev) => ({
                                ...prev,
                                assetId: value?.id || 0,
                                assetName: value?.name || ""
                            }));
                        }}
                        slotProps={{
                            listbox: {
                                onScroll: (event: React.SyntheticEvent) => {
                                    const listboxNode = event.currentTarget;
                                    const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1;
                                    if (isNearBottom && hasMoreAssets && !isLoading) {
                                        handleAssetLoadMore();
                                    }
                                },
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Asset"
                                variant="outlined"
                                required
                                sx={{marginTop: 2}}
                            />
                        )}
                        loading={isLoading}
                    />
                    <Autocomplete
                        options={filteredUsers}
                        getOptionLabel={(option) => option.username || ""}
                        getOptionKey={(option) => option.id}
                        filterOptions={(x) => x}
                        onInputChange={(event, value) => {
                            setUserSearch(value);
                            debouncedFetchUsers(value);
                        }}
                        onChange={(event, value) => {
                            setFormData((prev) => ({
                                ...prev,
                                userId: value?.id || 0,
                                username: value?.username || ""
                            }));
                        }}
                        slotProps={{
                            listbox: {
                                onScroll: (event: React.SyntheticEvent) => {
                                    const listboxNode = event.currentTarget;
                                    const isNearBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1;
                                    if (isNearBottom && hasMoreUsers && !isLoading) {
                                        handleUserLoadMore();
                                    }
                                },
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="User"
                                variant="outlined"
                                required
                            />
                        )}
                        loading={isLoading}
                    />
                    <TextField
                        label="Expected Return Date"
                        name="expectedReturnDate"
                        type="datetime-local"
                        value={formData.expectedReturnDate}
                        onChange={(e) => setFormData((prev) => ({...prev, expectedReturnDate: e.target.value}))}
                        fullWidth
                        required
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <TextField
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={(e) => setFormData((prev) => ({...prev, remarks: e.target.value}))}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog chi tiết giao dịch */}
            <Dialog open={openDetails} onClose={handleDetailsClose} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', borderRadius: 1}}>
                    Borrowing Details
                </DialogTitle>
                <DialogContent className="space-y-4" sx={{p: 3}} dividers>
                    {selectedBorrowing && (
                        <>
                            <Typography><strong>ID:</strong> {selectedBorrowing.id || "N/A"}</Typography>
                            <Typography><strong>Asset:</strong> {selectedBorrowing.assetName || "N/A"}</Typography>
                            <Typography><strong>User:</strong> {selectedBorrowing.username || "N/A"}</Typography>
                            <Typography>
                                <strong>Borrow Date:</strong>{" "}
                                {selectedBorrowing.borrowDate
                                    ? format(new Date(selectedBorrowing.borrowDate), 'dd/MM/yyyy HH:mm')
                                    : "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Expected Return Date:</strong>{" "}
                                {selectedBorrowing.expectedReturnDate
                                    ? format(new Date(selectedBorrowing.expectedReturnDate), 'dd/MM/yyyy HH:mm')
                                    : "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Return Date:</strong>{" "}
                                {selectedBorrowing.returnDate
                                    ? format(new Date(selectedBorrowing.returnDate), 'dd/MM/yyyy HH:mm')
                                    : "N/A"}
                            </Typography>
                            <Typography><strong>Status:</strong> {selectedBorrowing.status || "N/A"}</Typography>
                            <Typography><strong>Remarks:</strong> {selectedBorrowing.remarks || "N/A"}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailsClose} variant="outlined"
                            sx={{borderRadius: '20px', textTransform: 'none', px: 3}}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default React.memo(AssetBorrowingManagement);