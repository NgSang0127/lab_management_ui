import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TablePagination,
    IconButton
} from '@mui/material';
import {
    CategoryResponse, deleteCategoryById,
    fetchCategories,
    postCreateCategory,
    putUpdateCategoryById
} from "../../api/asset/categoryApi.ts";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useTranslation} from "react-i18next";

interface Category {
    id: number;
    name: string;
    description?: string;
}

const CategoryPage: React.FC = () => {
    const {t}=useTranslation();
    const [data, setData] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // rowsPerPage = size
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Dialog create/update category
    const [openDialog, setOpenDialog] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchCategories(page, rowsPerPage);
            // Kiểm tra cấu trúc dữ liệu trả về từ API
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err :any) {
            if (err ) {
                setError(err.response?.data?.message || err.error);
            } else {
                setError(t('manager_asset.category.errors.unexpected'));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseError = () => {
        setError(null);
    };

    const handleCloseSuccess = () => {
        setSuccess(null);
    };

    const handleOpenDialogCreate = () => {
        setEditCategory(null);
        setName('');
        setDescription('');
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = (cat: Category) => {
        setEditCategory(cat);
        setName(cat.name);
        setDescription(cat.description || '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        // Kiểm tra các trường bắt buộc
        if (name.trim() === '') {
            setError(t('manager_asset.category.name'));
            return;
        }
        try {
            setLoading(true);
            setError(null);
            if (editCategory) {
                await putUpdateCategoryById(editCategory.id, { id: editCategory.id, name, description });
                setSuccess(t('manager_asset.category.success.update'));
            } else {
                await postCreateCategory({ id: 0, name, description });
                setSuccess(t('manager_asset.category.success.create'));
            }
            await fetchData();
            handleCloseDialog();
        } catch (err :any) {
            if (err) {
                setError(err.error || err.response?.data?.message);
            } else {
                setError(t('manager_asset.category.errors.unexpected'));
            }
        } finally {
            setLoading(false);
        }
    };

    // Mở dialog xóa
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
                await deleteCategoryById(deleteId);
                setSuccess(t('manager_asset.category.success.delete'));
                await fetchData();
            } catch (err : any) {
                if (err) {
                    setError(err.response?.data?.message || err.error);
                } else {
                    setError(t('manager_asset.category.errors.unexpected'));
                }
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{t('manager_asset.category.title')}</h2>

            <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                {t('manager_asset.category.button_create')}
            </Button>

            {/* Loading Indicator */}
            <LoadingIndicator open={loading} />

            {/* Hiển thị alert error (nếu có) */}
            <CustomAlert
                open={!!error}
                message={error || ''}
                severity="error" // Mặc định
                onClose={handleCloseError}
            />

            {/* Hiển thị alert success (nếu có) */}
            <CustomAlert
                open={!!success}
                message={success || ''}
                severity="success"
                onClose={handleCloseSuccess}
            />

            {!loading && (
                <div className="mt-4">
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="categories">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{t('manager_asset.category.name')}</TableCell>
                                    <TableCell>{t('manager_asset.category.description')}</TableCell>
                                    <TableCell>{t('manager_asset.category.actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((cat, index) => {
                                    const rowNumber = page * rowsPerPage + index + 1; // tính số thứ tự
                                    return (
                                        <TableRow key={cat.id}>
                                            <TableCell>{rowNumber}</TableCell>
                                            <TableCell>{cat.id}</TableCell>
                                            <TableCell>{cat.name}</TableCell>
                                            <TableCell>{cat.description}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    sx={{ color: 'primary.main' }}  // Màu xanh
                                                    size="small"
                                                    onClick={() => handleOpenDialogEdit(cat)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    sx={{ color: 'error.main' }}  // Màu đỏ
                                                    size="small"
                                                    onClick={() => handleDeleteClick(cat.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            {t('manager_asset.category.no_category')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
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
                            labelRowsPerPage={t("pagination.rowsPerPage")}
                        />
                    </Box>
                </div>
            )}

            {/* Dialog Create/Update */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editCategory ? t('manager_asset.category.update_title') : t('manager_asset.category.create_title')}</DialogTitle>
                <DialogContent className="space-y-4">
                    <TextField
                        label={t('manager_asset.category.name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label={t('manager_asset.category.name')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        {t('manager_asset.category.button_cancel')}
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {t('manager_asset.category.button_save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Xác nhận Xóa */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>{t('manager_asset.category.dialog_title')}</DialogTitle>
                <DialogContent>
                    <div>{t('manager_asset.category.dialog_content')}</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} variant="outlined">
                        {t('manager_asset.category.button_cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        {t('manager_asset.category.button_delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};

export default CategoryPage;
