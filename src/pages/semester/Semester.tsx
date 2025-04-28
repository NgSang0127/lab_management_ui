import React, { useEffect, useState } from 'react';
import {
    Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridCellParams, GridToolbar, GridValueGetter,
} from '@mui/x-data-grid';
import CustomAlert from '../../components/support/CustomAlert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { CustomNoRowsOverlay } from '../../components/support/CustomNoRowsOverlay';
import { Helmet } from 'react-helmet-async';
import {
    deleteSemesterById,
    fetchSemesters,
    postCreateSemester,
    putUpdateSemesterById
} from "../../services/semester/semesterApi.ts";
import {format} from "date-fns";
import {AssetResponse} from "../../services/asset/assetApi.ts";

interface Semester {
    id: number;
    name: string;
    academicYear: string;
    startDate: string;
    endDate: string;
}

const Semester: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Pagination
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Dialog create/update semester
    const [openDialog, setOpenDialog] = useState(false);
    const [editSemester, setEditSemester] = useState<Semester | null>(null);
    const [name, setName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Dialog xác nhận xóa
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const formatAcademicYear = (input: string): string => {
        // Nếu input có dạng YYYY-YYYY, thêm khoảng trắng
        const regex = /^(\d{4})-(\d{4})$/;
        if (regex.test(input)) {
            return input.replace(regex, '$1 - $2');
        }
        // Trả về input nguyên bản nếu không khớp định dạng
        return input;
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchSemesters(page, rowsPerPage);
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            setError(err.message || t('manager_asset.semester.errors.unexpected'));
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
        setEditSemester(null);
        setName('');
        setAcademicYear('');
        setStartDate('');
        setEndDate('');
        setOpenDialog(true);
    };

    const handleOpenDialogEdit = (sem: Semester) => {
        setEditSemester(sem);
        setName(sem.name);
        setAcademicYear(sem.academicYear);
        setStartDate(sem.startDate);
        setEndDate(sem.endDate);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSave = async () => {
        if (name.trim() === '' || academicYear.trim() === '' || !startDate || !endDate) {
            setError(t('manager_asset.semester.errors.required_fields'));
            setSuccess(null);
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError(t('manager_asset.semester.errors.invalid_dates'));
            setSuccess(null);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const semesterData: Semester = {
                id: editSemester ? editSemester.id : 0,
                name,
                academicYear,
                startDate,
                endDate,
            };
            if (editSemester) {
                await putUpdateSemesterById(editSemester.id, semesterData);
                setSuccess(t('manager_asset.semester.success.update'));
            } else {
                await postCreateSemester(semesterData);
                setSuccess(t('manager_asset.semester.success.create'));
            }
            await fetchData();
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || t('manager_asset.semester.errors.unexpected'));
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
                await deleteSemesterById(deleteId);
                setSuccess(t('manager_asset.semester.success.delete'));
                await fetchData();
            } catch (err: any) {
                setError(err.message || t('manager_asset.semester.errors.unexpected'));
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const columns: GridColDef<Semester>[] = [
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
            headerName: t('manager_asset.semester.name'),
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'academicYear',
            headerName: t('manager_asset.semester.academic_year'),
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'startDate',
            headerName: t('manager_asset.semester.start_date'),
            minWidth: 150,
            flex: 1,
            valueGetter: ((value) => {
                return value ? format(new Date(value as string), 'dd/MM/yyyy') : 'N/A';
            }) as GridValueGetter<Semester>,
        },
        {
            field: 'endDate',
            headerName: t('manager_asset.semester.end_date'),
            minWidth: 150,
            flex: 1,
            valueGetter: ((value) => {
                return value ? format(new Date(value as string), 'dd/MM/yyyy') : 'N/A';
            }) as GridValueGetter<Semester>,
        },
        {
            field: 'actions',
            headerName: t('manager_asset.semester.actions'),
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
                        onClick={() => handleOpenDialogEdit(params.row as Semester)}
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
                <title>Semester | Lab Management IT</title>
            </Helmet>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">{t('manager_asset.semester.title')}</h2>

                <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                    {t('manager_asset.semester.button_create')}
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
                    <DialogTitle>
                        {editSemester ? t('manager_asset.semester.update_title') : t('manager_asset.semester.create_title')}
                    </DialogTitle>
                    <DialogContent className="space-y-4">
                        <TextField
                            label={t('manager_asset.semester.name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            label={t('manager_asset.semester.academic_year')}
                            value={academicYear}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                const formattedValue = formatAcademicYear(inputValue);
                                setAcademicYear(formattedValue);
                            }}
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            label={t('manager_asset.semester.start_date')}
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            slotProps={{inputLabel:{ shrink: true }}}
                        />
                        <TextField
                            label={t('manager_asset.semester.end_date')}
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            slotProps={{inputLabel:{ shrink: true }}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} variant="outlined">
                            {t('manager_asset.semester.button_cancel')}
                        </Button>
                        <Button onClick={handleSave} variant="contained" color="primary">
                            {t('manager_asset.semester.button_save')}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog Xác nhận Xóa */}
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>{t('manager_asset.semester.dialog_title')}</DialogTitle>
                    <DialogContent>
                        <div>{t('manager_asset.semester.dialog_content')}</div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} variant="outlined">
                            {t('manager_asset.semester.button_cancel')}
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">
                            {t('manager_asset.semester.button_delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default Semester;