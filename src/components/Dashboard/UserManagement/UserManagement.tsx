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
import { createUser, deleteUser, getUsers, updateUser } from "../../../state/Admin/Reducer.ts";
import { CreateUserRequestByAdmin } from "../../../state/Admin/Action.ts";
import { SelectChangeEvent } from "@mui/material/Select";
import debounce from 'lodash.debounce';


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
    const dispatch = useAppDispatch();
    const { user, isLoading, error, success, totalElements } = useSelector(
        (state: RootState) => state.admin
    );

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

    // Handle input changes
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<"student" | "teacher">
    ) => {
        const { name, value } = event.target;
        if (name && typeof value === "string") {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
        if (window.confirm("Are you sure you want to delete this user?")) {
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
                User Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                className="mb-6"
            >
                Add User
            </Button>

            {/* Filter Controls */}
            <Box className="mt-4">
                <Grid container spacing={2}>
                    <Grid size={{ xs:12, sm:6}}>
                        <TextField
                            label="Search"
                            value={keyword}
                            onChange={handleKeywordChange}
                            variant="outlined"
                            fullWidth
                            placeholder="Search by name, username..."
                        />
                    </Grid>
                    <Grid size={{ xs:12, sm:6}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="role-filter-label">Filter by Role</InputLabel>
                            <Select
                                labelId="role-filter-label"
                                id="role-filter"
                                value={roleFilter}
                                onChange={handleRoleFilterChange}
                                label="Filter by Role"
                            >
                                <MenuItem value="">
                                    <em>All Roles</em>
                                </MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                                {/* Thêm các role khác nếu có */}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Feedback Messages */}
            {isLoading && (
                <div className="flex justify-center items-center mb-4">
                    <CircularProgress />
                </div>
            )}
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
                            <TableCell sx={{ minWidth: 50 }}><strong>ID</strong></TableCell>
                            <TableCell sx={{ minWidth: 100 }}><strong>First Name</strong></TableCell>
                            <TableCell sx={{ minWidth: 100 }}><strong>Last Name</strong></TableCell>
                            <TableCell sx={{ minWidth: 200 }}><strong>Email</strong></TableCell>
                            <TableCell sx={{ minWidth: 120 }}><strong>Role</strong></TableCell>
                            <TableCell sx={{ minWidth: 150 }} align="center"><strong>Actions</strong></TableCell>
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
                                    <TableCell>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleOpen({
                                                ...u,
                                                password: "",
                                            })}
                                            sx={{
                                                marginRight: 1,
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(u.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No users found.
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
                        {editUser ? "Edit User" : "Add User"}
                    </Typography>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Last Name"
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
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>
                                Select Role
                            </MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="teacher">Teacher</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required={!editUser} // Password required only for new users
                    />
                    <TextField
                        label="Phone Number"
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
                        label="Enabled"
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
                        label="Account Locked"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isLoading}
                    >
                        {editUser ? "Update User" : "Create User"}
                    </Button>
                </Box>
            </Modal>
        </div>
    );

};

export default UserManagement;
