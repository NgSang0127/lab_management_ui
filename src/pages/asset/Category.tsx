import React, { useEffect, useState } from 'react';
import {
    Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridCellParams, GridToolbar,
} from '@mui/x-data-grid';
import {
    CategoryResponse, deleteCategoryById,
    fetchCategories,
    postCreateCategory,
    putUpdateCategoryById
} from "../../services/asset/categoryApi.ts";
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import {CustomNoRowsOverlay} from "../../components/support/CustomNoRowsOverlay.tsx";
import {Helmet} from "react-helmet-async";

interface Category {
    id: number;
    name: string;
    description?: string;
}

const Category: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Pagination
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
            console.log('API Response:', res);
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            if (err) {
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

    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

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

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSave = async () => {
        if (name.trim() === '') {
            setError(t('manager_asset.category.name'));
            setSuccess(null);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            if (editCategory) {
                await putUpdateCategoryById(editCategory.id, { id: editCategory.id, name, description });
                setSuccess(t('manager_asset.category.success.update'));
            } else {
                await postCreateCategory({ id: 0, name, description });
                setSuccess(t('manager_asset.category.success.create'));
            }
            await fetchData();
            handleCloseDialog();
        } catch (err: any) {
            if (err) {
                setError(err.error || err.response?.data?.message);
            } else {
                setError(t('manager_asset.category.errors.unexpected'));
            }
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
                await deleteCategoryById(deleteId);
                setSuccess(t('manager_asset.category.success.delete'));
                await fetchData();
            } catch (err: any) {
                if (err) {
                    setError(err.response?.data?.message || err.error);
                } else {
                    setError(t('manager_asset.category.errors.unexpected'));
                }
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const columns: GridColDef<CategoryResponse>[] = [
        {
            field: 'id',
            headerName: 'No.',
            minWidth: 100,
            flex: 0.5,
            sortable: false,
            filterable: false,
            valueGetter: (value, row) => {
                const index = data.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * rowsPerPage : '-';
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'name',
            headerName: t('manager_asset.category.name'),
            minWidth: 150,
            flex: 1,

        },
        {
            field: 'description',
            headerName: t('manager_asset.category.description'),
            minWidth: 200,
            flex: 2,

        },
        {
            field: 'actions',
            headerName: t('manager_asset.category.actions'),
            minWidth: 120,
            flex: 0.5,
            sortable: false,
            filterable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridCellParams) => (
                <>
                    <IconButton
                        sx={{ color: 'primary.main' }}
                        size="small"
                        onClick={() => handleOpenDialogEdit(params.row as Category)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        sx={{ color: 'error.main' }}
                        size="small"
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Category | Lab Management IT</title>
            </Helmet>
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{t('manager_asset.category.title')}</h2>

            <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                {t('manager_asset.category.button_create')}
            </Button>

            <CustomAlert
                open={!!error && !success}
                message={error || ''}
                severity="error"
                onClose={handleCloseError}
            />
            <CustomAlert
                open={!!success && !error}
                message={success || ''}
                severity="success"
                onClose={handleCloseSuccess}
            />

            <Box sx={{ height: '700px', width: '100%', mt: 4 }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    paginationMode="server"
                    rowCount={totalElements}
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setRowsPerPage(newModel.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 25]}
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
                        label={t('manager_asset.category.description')}
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
        </>
    );
};

export default Category;