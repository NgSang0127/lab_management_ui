import React, {useEffect, useMemo, useState} from "react";
import {
    Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem,
    FormControlLabel, Switch, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Chip,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
    DataGrid,
    GridColDef,
    GridCellParams,
    GridToolbar,
    GridValueGetter,
    GridRenderCellParams
} from '@mui/x-data-grid';
import {RootState, useAppDispatch} from "../../state/store.ts";
import {useSelector} from "react-redux";
import {
    createUser,
    deleteUser,
    getUsers,
    promoteUser,
    transferOwnership,
    updateUser
} from "../../state/admin/thunk.ts";
import {CreateUserRequestByAdmin} from "../../state/admin/adminSlice.ts";
import {SelectChangeEvent} from "@mui/material/Select";
import debounce from 'lodash.debounce';
import {useTranslation} from "react-i18next";
import {stringToColor} from "../../utils/randomColors.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import {format, parse} from "date-fns";
import {CustomNoRowsOverlay} from "../../components/support/CustomNoRowsOverlay.tsx";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import {AssetResponse, OperationTime, Status} from "../../services/asset/assetApi.ts";
import {Role, User} from "../../state/auth/authSlice.ts";
import {Helmet} from "react-helmet-async";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    role: "student" | "teacher" | '';
    enabled: boolean;
    username: string;
    password: string;
    phoneNumber: string;
    accountLocked: boolean;
}

const UserManagement: React.FC = () => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {user, isLoading} = useSelector((state: RootState) => state.admin);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const filteredUsers = user.filter((u) => u.id !== currentUser?.id);

    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState<(CreateUserRequestByAdmin & { id: number }) | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        enabled: true,
        username: "",
        password: "",
        phoneNumber: "",
        accountLocked: false,
    });

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [keyword, setKeyword] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("");

    const debouncedFetchUsers = useMemo(
        () =>
            debounce((currentPage: number, currentRowsPerPage: number, currentKeyword: string, currentRole: string) => {
                dispatch(getUsers({
                    page: currentPage,
                    size: currentRowsPerPage,
                    keyword: currentKeyword,
                    role: currentRole
                })).then((result) => {
                    if (getUsers.fulfilled.match(result)) {
                        setTotalElements(result.payload.totalElements);
                    } else if (getUsers.rejected.match(result)) {
                        setError(result.error.message || "Failed to fetch users.");
                    }
                });
            }, 500),
        [dispatch]
    );

    useEffect(() => {
        debouncedFetchUsers(page, rowsPerPage, keyword, roleFilter);
        return () => {
            debouncedFetchUsers.cancel();
        };
    }, [page, rowsPerPage, keyword, roleFilter, debouncedFetchUsers]);

    const handleOpen = (user: (CreateUserRequestByAdmin & { id: number }) | null = null) => {
        setEditUser(user);
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                role: user.role.toLowerCase() as "student" | "teacher",
                enabled: user.enabled,
                username: user.username || "",
                password: "",
                phoneNumber: user.phoneNumber || "",
                accountLocked: user.accountLocked,
            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                role: "",
                enabled: true,
                username: "",
                password: "",
                phoneNumber: "",
                accountLocked: false,
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);
    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.role || !formData.username || (!editUser)) {
            setError("Please fill in all required fields.");
            setSuccess(null);
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            if (editUser) {
                await dispatch(updateUser({id: editUser.id, request: formData})).unwrap();
                setSuccess("user updated successfully.");
            } else {
                await dispatch(createUser(formData)).unwrap();
                setSuccess("user created successfully.");
            }
            handleClose();
            debouncedFetchUsers(page, rowsPerPage, keyword, roleFilter);
        } catch (err: any) {
            setError(err ?? 'An unexpected error occurred.');
            setSuccess(null);
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const {name, value} = event.target;
        if (!name) return;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('user_management.dialog'))) {
            try {
                setError(null);
                setSuccess(null);
                await dispatch(deleteUser(id)).unwrap();
                setSuccess("user deleted successfully.");
                debouncedFetchUsers(page, rowsPerPage, keyword, roleFilter);
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
                setSuccess(null);
            }
        }
    };

    const columns: GridColDef<User>[] = [
        {
            field: 'id',
            headerName: 'No.',
            minWidth: 100,
            flex: 0.5,
            sortable: false,
            filterable: false,
            valueGetter: (value, row) => {
                const index = filteredUsers.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            },
        },
        {
            field: 'lastName',
            headerName: t('user_management.lastName'),
            minWidth: 120,
            flex: 1,
        },
        {
            field: 'firstName',
            headerName: t('user_management.firstName'),
            minWidth: 120,
            flex: 1,
        },
        {
            field: 'username',
            headerName: t('user_management.username'),
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            flex: 2,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'avatar',
            headerName: 'Avatar',
            minWidth: 100,
            flex: 0.5,
            renderCell: (params: GridCellParams) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Avatar
                        src={params.row.image || undefined}
                        alt={params.row.firstName}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: !params.row.image ? stringToColor(params.row.firstName || '') : 'transparent',
                            color: !params.row.image ? 'white' : 'inherit',
                        }}
                    >
                        {!params.row.image && params.row.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>
            ),
        },
        {
            field: 'createdDate',
            headerName: 'Created Date',
            minWidth: 150,
            flex: 1.5,
            align: 'center',
            headerAlign: 'center',
            valueGetter: ((value) =>
                    value
                        ? format(
                            parse(value as string, 'dd/MM/yyyy HH:mm:ss', new Date()),
                            'dd/MM/yyyy HH:mm'
                        )
                        : ''
            ) as GridValueGetter,
        },
        {
            field: 'lastModifiedDate',
            headerName: 'Last Modified',
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueGetter: ((value) =>
                value ? format(new Date(value as string), 'dd/MM/yyyy HH:mm') : '') as GridValueGetter<any>,
        },
        {
            field: 'role',
            headerName: t('user_management.role'),
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<User, string>) => {
                const value = params.value;

                const getLabel = (val: string | undefined) => {
                    switch (val) {
                        case Role.ADMIN:
                            return 'admin';
                        case Role.STUDENT:
                            return 'Student';
                        case Role.CO_OWNER:
                            return 'Co_Owner';
                        case Role.OWNER:
                            return 'Owner';
                        case Role.TEACHER:
                            return 'Teacher';
                        default:
                            return 'N/A';
                    }
                };

                const getColor = (val: string | undefined): 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' => {
                    switch (val) {
                        case Role.ADMIN:
                            return 'primary';
                        case Role.STUDENT:
                            return 'success';
                        case Role.TEACHER:
                            return 'secondary';
                        case Role.OWNER:
                            return 'warning';
                        case Role.CO_OWNER:
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
                        sx={{width: '70px', fontWeight: 200, borderRadius: '20px', justifyContent: 'center'}}
                    />
                );
            }
        },
        {
            field: 'actions',
            headerName: t('user_management.actions'),
            minWidth: 200,
            flex: 2,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params: GridCellParams) => (
                <>
                    <IconButton
                        sx={{color: 'primary.main'}}
                        size="small"
                        onClick={() => handleOpen({
                            id: params.row.id,
                            firstName: params.row.firstName,
                            lastName: params.row.lastName,
                            email: params.row.email,
                            role: params.row.role,
                            enabled: params.row.enabled,
                            username: params.row.username,
                            password: "",
                            phoneNumber: params.row.phoneNumber || "",
                            accountLocked: params.row.accountLocked,
                        })}
                    >
                        <EditIcon/>
                    </IconButton>
                    {((currentUser?.role === "OWNER" || currentUser?.role === "CO_OWNER") &&
                        (params.row.role !== 'OWNER' && params.row.role !== 'CO_OWNER')) && (
                        <>
                            <IconButton
                                sx={{color: 'warning.main'}}
                                size="small"
                                onClick={() => dispatch(transferOwnership(params.row.id))}
                            >
                                <TransferWithinAStationIcon/>
                            </IconButton>
                            <IconButton
                                sx={{color: 'success.main'}}
                                size="small"
                                onClick={() => dispatch(promoteUser(params.row.id))}
                            >
                                <VerifiedUserIcon/>
                            </IconButton>
                        </>
                    )}
                    <IconButton
                        sx={{color: 'error.main'}}
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
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
                <title>User Management | Lab Management IT</title>
            </Helmet>
            <div className="p-6">
                <Typography variant="h4" className="pb-4">
                    {t('user_management.title')}
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpen()}
                        className="mb-6"
                    >
                        {t('user_management.add_button')}
                    </Button>

                    <Box sx={{display: "flex", gap: 2, ml: "auto"}}>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    label={t('user_management.search')}
                                    value={keyword}
                                    onChange={(e) => {
                                        setKeyword(e.target.value);
                                        setPage(0);
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {borderRadius: 10},
                                        maxWidth: '300px'
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    placeholder={t('user_management.search_placeholder')}
                                />
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="outlined"
                                             sx={{minWidth: 180, '& .MuiOutlinedInput-root': {borderRadius: 10}}}>
                                    <InputLabel id="role-filter-label">{t('user_management.filter')}</InputLabel>
                                    <Select
                                        labelId="role-filter-label"
                                        value={roleFilter}
                                        onChange={(e: SelectChangeEvent<string>) => {
                                            setRoleFilter(e.target.value);
                                            setPage(0);
                                        }}
                                        label={t('user_management.filter_placeholder')}
                                    >
                                        <MenuItem value="">
                                            <em>{t('user_management.none')}</em>
                                        </MenuItem>
                                        <MenuItem value="student">{t('user_management.student')}</MenuItem>
                                        <MenuItem value="teacher">{t('user_management.teacher')}</MenuItem>
                                        <MenuItem value="owner">{t('user_management.owner')}</MenuItem>
                                        <MenuItem value="co_owner">{t('user_management.co_owner')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <CustomAlert
                    open={!!error && !success}
                    message={error || ""}
                    severity="error"
                    onClose={handleCloseError}
                />
                <CustomAlert
                    open={!!success && !error}
                    message={success || ""}
                    severity="success"
                    onClose={handleCloseSuccess}
                />

                <Box sx={{height: '700px', width: '100%', mt: 4}}>
                    <DataGrid
                        rows={filteredUsers}
                        columnHeaderHeight={56}
                        columns={columns.map((col) => ({
                            ...col,
                            align: 'center',
                            headerAlign: 'center',
                        }))}
                        paginationMode="server"
                        rowCount={totalElements}
                        paginationModel={{page, pageSize: rowsPerPage}}
                        onPaginationModelChange={(newModel) => {
                            setPage(newModel.page);
                            setRowsPerPage(newModel.pageSize);
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        loading={isLoading}
                        slots={{
                            toolbar: GridToolbar,
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        slotProps={{
                            pagination: {
                                showFirstButton: true,
                                showLastButton: true,
                            },
                        }}
                        rowHeight={66}
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

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editUser ? t('user_management.editUser') : t('user_management.add_button')}
                    </DialogTitle>
                    <DialogContent className="space-y-4" sx={{mt: 2}}>
                        <TextField
                            label={t('user_management.firstName')}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{marginTop: 2}}
                        />
                        <TextField
                            label={t('user_management.lastName')}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label={t('user_management.username')}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel id="role-label">{t('user_management.role')}</InputLabel>
                            <Select
                                labelId="role-label"
                                label={t('user_management.role')}
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="" disabled>
                                    {t('user_management.select_role')}
                                </MenuItem>
                                <MenuItem value="student">{t('user_management.student')}</MenuItem>
                                <MenuItem value="teacher">{t('user_management.teacher')}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label={t('user_management.password')}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required={!editUser}
                        />
                        <TextField
                            label={t('user_management.phone')}
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.enabled}
                                    onChange={handleToggleChange}
                                    name="enabled"
                                    color="primary"
                                />
                            }
                            label={t('user_management.enabled')}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.accountLocked}
                                    onChange={handleToggleChange}
                                    name="accountLocked"
                                    color="secondary"
                                />
                            }
                            label={t('user_management.accountLocked')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="outlined">
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading}>
                            {editUser ? t('user_management.update_button') : t('user_management.create_button')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default UserManagement;