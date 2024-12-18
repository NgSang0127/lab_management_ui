import React, { useEffect, useState } from "react";
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
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { useSelector } from "react-redux";
import { createUser, deleteUser, getUsers, updateUser } from "../../../state/Admin/Reducer.ts";
import { CreateUserRequestByAdmin } from "../../../state/Admin/Action.ts";
import {SelectChangeEvent} from "@mui/material/Select";

const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: '90%', sm: 400 }, // Make it responsive on small screens
    bgcolor: "background.paper",
    borderRadius: 2, // Rounded corners for modern look
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2, // Add space between elements
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
    const { user, isLoading, error, success, page, totalElements } = useSelector(
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
        role: "", // Default role
        enabled: true,
        username: "",
        password: "",
        phoneNumber: "",
        accountLocked: false,
    });
    // Pagination state
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    // Fetch users on mount or when page changes
    useEffect(() => {
        dispatch(getUsers({ page, size: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    // Open modal
    const handleOpen = (user: (CreateUserRequestByAdmin & { id: number }) | null = null) => {
        setEditUser(user);
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                role: user.role.toLowerCase() as "student" | "teacher", // Ensure lowercase
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
        dispatch(getUsers({ page: newPage, size: rowsPerPage }));
    };

    // Handle change of rows per page
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        dispatch(getUsers({ page: 0, size: newSize })); // Reset to page 0 when rows per page changes
    };

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">
                User Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                className="mb-4"
            >
                Add User
            </Button>

            {isLoading && (
                <div className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            )}
            {error && (
                <Typography variant="body2" color="error">
                    {typeof error === "string" ? error : JSON.stringify(error)}
                </Typography>
            )}

            {success && <Typography variant="body2" color="success.main">{success}</Typography>}

            <TableContainer component={Paper} className="mt-7">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>{u.id}</TableCell>
                                <TableCell>{u.firstName}</TableCell>
                                <TableCell>{u.lastName}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpen({
                                            ...u,
                                            password: "",
                                        })}
                                        sx={{
                                            backgroundColor: "blue",
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: "darkblue",
                                            },
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleDelete(u.id)}
                                        className="ml-2"
                                        sx={{
                                            backgroundColor: "red",
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: "darkred",
                                            },
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    className="pr-5"
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ position: 'relative', left: '-10px' }}
                />
            </TableContainer>

            {/* Modal */}
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
                        className="mb-4"
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        className="mb-4"
                    />
                    <FormControl fullWidth className="mb-4">
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
                        className="mb-4"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                        className="mb-4"
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
                        className="mb-2"
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
                        className="mb-4"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        {editUser ? "Update User" : "Create User"}
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default UserManagement;
