import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    TextField,
    Typography,
    Box,
    TablePagination,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { useSelector } from "react-redux";
import {
    createUser,
    deleteUser,
    getUsers,
    promoteUser,
    transferOwnership,
    updateUser
} from "../../../state/Admin/Reducer.ts";
import { CreateUserRequestByAdmin } from "../../../state/Admin/Action.ts";
import { SelectChangeEvent } from "@mui/material/Select";
import debounce from 'lodash.debounce';
import LoadingIndicator from "../../Support/LoadingIndicator.tsx";
import {useTranslation} from "react-i18next";


const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: '90%', sm: 500 },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

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
    const {t}=useTranslation();
    const dispatch = useAppDispatch();
    const { user, isLoading, error, success, totalElements } = useSelector(
        (state: RootState) => state.admin
    );
    const currentUser = useSelector((state: RootState) => state.auth.user);

    console.log("userr",user);

    console.log("Role:", currentUser?.role, typeof currentUser?.role); // Kiểm tra role và kiểu dữ liệu

    // State for modal visibility
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState<(CreateUserRequestByAdmin & { id: number }) | null>(null);


    // Form state with all required fields
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

    // Pagination state
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0); // Local state for current page

    // Filter state
    const [keyword, setKeyword] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("");

    // Fetch users whenever page, rowsPerPage, keyword or roleFilter change

    const debouncedFetchUsers = useMemo(
        () =>
            debounce((currentPage: number, currentRowsPerPage: number, currentKeyword: string, currentRole: string) => {
                dispatch(getUsers({ page: currentPage, size: currentRowsPerPage, keyword: currentKeyword, role: currentRole }));
            }, 500),
        [dispatch]
    );
    // Fetch users whenever page, rowsPerPage, keyword or roleFilter change
    useEffect(() => {
        debouncedFetchUsers(page, rowsPerPage, keyword, roleFilter);
        // Cleanup debounce on unmount
        return () => {
            debouncedFetchUsers.cancel();
        };
    }, [page, rowsPerPage, keyword, roleFilter, debouncedFetchUsers]);


    // Open modal
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
                password: "", // Clear password for security
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

    // Form submission
    const handleSubmit = () => {
        if (editUser) {
            dispatch(updateUser({ id: editUser.id, request: formData }));
        } else {
            dispatch(createUser(formData));
        }
        handleClose();
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<"student" | "teacher">
    ) => {
        const { name, value } = event.target;

        if (!name) return; // Đảm bảo có `name` trước khi cập nhật

        setFormData((prev) => ({
            ...prev,
            [name]: value, // Chấp nhận cả string từ TextField và Select
        }));
    };


    // Handle toggle changes for switches
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    // Delete user
    const handleDelete = (id: number) => {
        if (window.confirm(t('user_management.dialog'))) {
            dispatch(deleteUser(id));
        }
    };

    // Handle change of page
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Handle change of rows per page
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0); // Reset to first page when rows per page changes
    };

    // Handle filter changes
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    const handleRoleFilterChange = (e: SelectChangeEvent<string>) => {
        setRoleFilter(e.target.value);
        setPage(0); // Reset to first page when filter changes
    };

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-6">
                {t('user_management.title')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                className="mb-6"
            >
                {t('user_management.add_button')}
            </Button>

            {/* Filter Controls */}
            <Box className="mt-4">
                <Grid container spacing={2}>
                    <Grid size={{ xs:12, sm:6}}>
                        <TextField
                            label={t('user_management.search')}
                            value={keyword}
                            onChange={handleKeywordChange}
                            variant="outlined"
                            fullWidth
                            placeholder={t('user_management.search_placeholder')}
                        />
                    </Grid>
                    <Grid size={{ xs:12, sm:6}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="role-filter-label">{t('user_management.filter')}</InputLabel>
                            <Select
                                labelId="role-filter-label"
                                id="role-filter"
                                value={roleFilter}
                                onChange={handleRoleFilterChange}
                                label={t('user_management.filter_placeholder')}
                            >
                                <MenuItem value="">
                                    <em>{t('user_management.none')}</em>
                                </MenuItem>
                                <MenuItem value="student">{t('user_management.student')}</MenuItem>
                                <MenuItem value="teacher">{t('user_management.teacher')}</MenuItem>
                                <MenuItem value="owner">{t('user_management.owner')}</MenuItem>
                                <MenuItem value="co_owner">{t('user_management.co_owner')}</MenuItem>
                                {/* Thêm các role khác nếu có */}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Feedback Messages */}
            {isLoading && <LoadingIndicator open={isLoading}/>}
            {error && (
                <Typography variant="body2" color="error" className="mb-4">
                    {typeof error === "string" ? error : JSON.stringify(error)}
                </Typography>
            )}

            {success && <Typography variant="body2" color="success.main" className="mb-4">{success}</Typography>}

            <TableContainer component={Paper} className="mt-4 shadow-lg">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ minWidth: 50 }}><strong>No.</strong></TableCell>
                            <TableCell sx={{ minWidth: 100 }}><strong>{t('user_management.firstName')}</strong></TableCell>
                            <TableCell sx={{ minWidth: 100 }}><strong>{t('user_management.lastName')}</strong></TableCell>
                            <TableCell sx={{ minWidth: 200 }}><strong>Email</strong></TableCell>
                            <TableCell sx={{ minWidth: 120 }}><strong>{t('user_management.role')}</strong></TableCell>
                            <TableCell sx={{ minWidth: 150 }} align="center"><strong>{t('user_management.actions')}</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user.length > 0 ? (
                            user.map((u) => (
                                <TableRow key={u.id} hover>
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>{u.firstName}</TableCell>
                                    <TableCell>{u.lastName}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.role ? (typeof u.role === 'object' ? u.role.name : u.role) : "N/A"}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleOpen({
                                                id: u.id,
                                                firstName: u.firstName,
                                                lastName: u.lastName,
                                                email: u.email,
                                                role: u.role, // Đảm bảo role là string
                                                enabled: u.enabled,
                                                username: u.username,
                                                password: "", // Mặc định để trống vì lý do bảo mật
                                                phoneNumber: u.phoneNumber || "",
                                                accountLocked: u.accountLocked,
                                            })}
                                            sx={{
                                                marginRight: 1,
                                            }}
                                        >
                                            {t('user_management.edit_button')}
                                        </Button>
                                        {/* Nếu là owner hoặc co_owner, hiển thị các nút đặc biệt */}
                                        {((currentUser?.role === "OWNER" || currentUser?.role === "CO_OWNER") && (u?.role!== 'OWNER' && u?.role !== 'CO_OWNER')) && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    onClick={() => dispatch(transferOwnership(u.id))}
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    {t('user_management.transfer_button')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        marginRight: 1,
                                                    }}
                                                    onClick={() => dispatch(promoteUser(u.id ))}
                                                >
                                                    {t('user_management.promote_button')}
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(u.id)}
                                        >
                                            {t('user_management.delete_button')}
                                        </Button>

                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    {t('user_management.no_data')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage={t("pagination.rowsPerPage")}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    showFirstButton
                    showLastButton
                    sx={{ position: 'relative', left: '-10px' }}
                />
            </TableContainer>

            {/* Modal for Add/Edit User */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" className="mb-4">
                        {editUser ? t('user_management.editUser') : t('user_management.add_button')}
                    </Typography>
                    <TextField
                        label={t('user_management.firstName')}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        required
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
                        label={t('user_management.username')}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label={t('user_management.password')}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required={!editUser} // Password required only for new users
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isLoading}
                    >
                        {editUser ? t('user_management.update_button') : t('user_management.create_button')}
                    </Button>
                </Box>
            </Modal>
        </div>
    );

};

export default UserManagement;
