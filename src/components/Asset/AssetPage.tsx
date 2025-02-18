import React, {useEffect, useState, useMemo} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    AssetRequest,
    AssetResponse,
    deleteAssetById,
    fetchAssets,
    postCreateAsset,
    putUpdateAssetById,
    Status,
} from "../../api/asset/assetApi.ts";
import {CategoryResponse, fetchCategories} from "../../api/asset/categoryApi.ts";
import {fetchLocations, LocationResponse} from "../../api/asset/locationApi.ts";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import {format} from 'date-fns';
import {uploadImageToCloudinary} from "../../utils/uploadCloudinary.ts";
import {SelectChangeEvent} from "@mui/material/Select";
import {generateSerialNumber} from "../../utils/generateSerialNumber.ts";
import UserSelect from './UserSelect';
import debounce from 'lodash.debounce';
import {RootState} from "../../state/store.ts";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const AssetPage: React.FC = () => {
    const {t}=useTranslation();

    const {user} = useSelector(
        (state: RootState) => state.admin
    );
    console.log(user)
    const [data, setData] = useState<AssetResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Pagination
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Dialog for create/update
    const [openDialog, setOpenDialog] = useState(false);
    const [editAsset, setEditAsset] = useState<AssetRequest | null>(null);
    const [form, setForm] = useState<AssetRequest>({
        id: 0,
        name: '',
        description: '',
        image: '',
        serialNumber: "",
        status: Status.AVAILABLE,
        purchaseDate: new Date().toISOString().slice(0, 16),
        price: 0,
        categoryId: 0,
        locationId: 0,
        assignedUserId: 0,

    });

    // Dialog for delete confirmation
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Data for selects
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [locations, setLocations] = useState<LocationResponse[]>([]);

    // State for image upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Filter state
    const [keyword, setKeyword] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Debounced fetchData for keyword search
    const debouncedFetchData = useMemo(
        () => debounce((currentPage: number, currentRowsPerPage: number, currentKeyword: string, currentStatus: string) => {
            fetchData(currentPage, currentRowsPerPage, currentKeyword, currentStatus);
        }, 500),
        []
    );

    // Fetch assets with filters
    const fetchData = async (currentPage: number, currentRowsPerPage: number, currentKeyword: string, currentStatus: string) => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchAssets(currentPage, currentRowsPerPage, currentKeyword, currentStatus);
            // Kiểm tra cấu trúc phản hồi API
            if (res.content && res.totalElements !== undefined) {
                setData(res.content);
                setTotalElements(res.totalElements);
                console.log('Fetched Assets:', res.content);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            if (err) {
                setError(err.response?.data?.message || err.error);
                console.error('Error fetching assets:', err.response?.data?.message || err.error);
            } else {
                setError(t('manager_asset.errors.unexpected'));
                console.error('Error fetching assets:', err);
            }
        } finally {
            setLoading(false);
        }
};

// Fetch categories and locations for selects
const fetchSelectData = async () => {
    try {
        const [categoriesRes, locationsRes] = await Promise.all([
            fetchCategories(0, 50),
            fetchLocations(0, 50)
        ]);

        if (categoriesRes.content && categoriesRes.totalElements !== undefined) {
            setCategories(categoriesRes.content);
        } else {
            throw new Error('Invalid categories API response structure.');
        }
        if (locationsRes.content && locationsRes.totalElements !== undefined) {
            setLocations(locationsRes.content);
        } else {
            throw new Error('Invalid locations API response structure.');
        }
    } catch (err: any) {
        console.error('Failed to fetch select data:', err);
    }
};

useEffect(() => {
    debouncedFetchData(page, rowsPerPage, keyword, statusFilter);
    fetchSelectData();
    // Cleanup debounce on unmount
    return () => {
        debouncedFetchData.cancel();
    };
}, [page, rowsPerPage, keyword, statusFilter, debouncedFetchData]);

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
    setEditAsset(null);
    const currentDate = new Date().toISOString().slice(0, 16);
    setForm({
        id: 0,
        name: '',
        description: '',
        image: '',
        serialNumber: generateSerialNumber(),
        status: Status.AVAILABLE,
        purchaseDate: currentDate,
        price: 0,
        categoryId: 0,
        locationId: 0,
        assignedUserId: 0,

    });
    setSelectedFile(null);
    setOpenDialog(true);
};

const handleOpenDialogEdit = (asset: AssetResponse) => {
    setEditAsset(asset);
    setForm({
        id: asset.id,
        name: asset.name,
        description: asset.description || '',
        image: asset.image || '',
        serialNumber: asset.serialNumber,
        status: asset.status,
        purchaseDate: new Date(asset.purchaseDate).toISOString().slice(0, 16), // Định dạng lại ngày
        price: asset.price,
        categoryId: asset.categoryId,
        locationId: asset.locationId,
        assignedUserId: asset.assignedUserId || 0,
    });
    setSelectedFile(null);
    setOpenDialog(true);
};

const handleCloseDialog = () => {
    setOpenDialog(false);
};

function handleInputChange(e: SelectChangeEvent<Status>): void;
function handleInputChange(e: SelectChangeEvent<number>): void;
function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
function handleInputChange(e: any): void {
    const {name, value} = e.target;
    // Đảm bảo rằng các giá trị số không được âm
    if (['price', 'categoryId', 'locationId', 'assignedUserId'].includes(name)) {
        const numericValue = Number(value);
        if (numericValue < 0) {
            return;
        }
        setForm((prev) => ({
            ...prev,
            [name as string]: numericValue,
        }));
    } else {
        setForm((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    }
}

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            try {
                const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
                setForm((prev) => ({
                    ...prev,
                    image: uploadedUrl,
                }));

                console.log('Uploaded image URL:', uploadedUrl);
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
                setError(t('manager_asset.asset.errors.cloudinary'));
            } finally {
                setLoading(false);
            }
        }
    };


const handleSave = async () => {
    // Validation
    if (form.name.trim() === '') {
        setError(t('manager_asset.asset.errors.name'));
        return;
    }
    if (!form.serialNumber) {
        form.serialNumber = generateSerialNumber();
    }
    if (!form.purchaseDate) {
        setError(t('manager_asset.asset.errors.purchase_date'));
        return;
    }
    if (form.price <= 0) {
        setError(t('manager_asset.asset.errors.price'));
        return;
    }
    if (form.categoryId === 0) {
        setError(t('manager_asset.asset.errors.category'));
        return;
    }
    if (form.locationId === 0) {
        setError(t('manager_asset.asset.errors.location'));
        return;
    }

    try {
        setLoading(true);
        setError(null);

        // Nếu có file hình ảnh được chọn, upload lên Cloudinary
        if (selectedFile) {
            setUploadingImage(true);
            const imageUrl = await uploadImageToCloudinary(selectedFile);
            console.log('Uploaded Image URL:', imageUrl);
            setForm((prev) => ({
                ...prev,
                image: imageUrl,
            }));
            setUploadingImage(false);
        }

        // Đảm bảo purchaseDate được định dạng đúng
        const assetToSave = {
            ...form,
            purchaseDate: form.purchaseDate + ':00',
        };

        console.log('Saving Asset:', assetToSave);

        if (editAsset) {
            await putUpdateAssetById(editAsset.id, assetToSave);
            setSuccess(t('manager_asset.asset.success.update'));
            console.log('Updated Asset:', assetToSave);
        } else {
            await postCreateAsset(assetToSave);
            setSuccess(t('manager_asset.asset.success.create'));
            console.log('Created Asset:', assetToSave);
        }
        await fetchData(page, rowsPerPage, keyword, statusFilter);
        handleCloseDialog();
    } catch (err: any) {
        if (err) {
            console.error('Error response data:', err.response?.data);
            setError(err.response?.data?.message || err.error);
        } else {
            setError(t('manager_asset.asset.errors.unexpected'));
            console.error('Unexpected error:', err);
        }
    } finally {
        setLoading(false);
        setUploadingImage(false);
    }
};

// Open delete confirmation dialog
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
            await deleteAssetById(deleteId);
            setSuccess(t('manager_asset.asset.success.delete'));
            await fetchData(page, rowsPerPage, keyword, statusFilter);
        } catch (err : any) {
            if (err  ) {
                setError(err.response?.data?.message || err.error);
                console.error('Error deleting asset:', err.response?.data?.message || err.error);
            } else {
                setError(t('manager_asset.asset.errors.unexpected'));
                console.error('Error deleting asset:', err);
            }
        } finally {
            setLoading(false);
            handleCloseDeleteDialog();
        }
    }
};

// Debugging: Log form.image whenever it changes
useEffect(() => {
    if (form.image) {
        console.log('form.image updated:', form.image);
    }
}, [form.image]);

// Handle filter changes
const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(0); // Reset to first page when filter changes
};

const handleStatusFilterChange = (e: SelectChangeEvent<string>) => {
    setStatusFilter(e.target.value);
    setPage(0); // Reset to first page when filter changes
};

return (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{t('manager_asset.asset.title')}</h2>

        <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
            {t('manager_asset.asset.button_create')}
        </Button>

        {/* Loading Indicator */}
        <LoadingIndicator open={loading || uploadingImage}/>

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
                {/* Filter Controls */}
                <Box className="mb-4">
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField
                                label={t('manager_asset.asset.button_search')}
                                value={keyword}
                                onChange={handleKeywordChange}
                                variant="outlined"
                                fullWidth
                                placeholder="Search by name, description..."
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="status-filter-label">{t('manager_asset.asset.button_filter')}</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    label={t('manager_asset.asset.button_filter')}
                                >
                                    <MenuItem value="">
                                        <em>{t('manager_asset.asset.all_status')}</em>
                                    </MenuItem>
                                    <MenuItem value={Status.AVAILABLE}>{t('manager_asset.asset.available_status')}</MenuItem>
                                    <MenuItem value={Status.IN_USE}>{t('manager_asset.asset.in_use_status')}</MenuItem>
                                    <MenuItem value={Status.MAINTENANCE}>{t('manager_asset.asset.maintenance_status')}</MenuItem>
                                    <MenuItem value={Status.RETIRED}>{t('manager_asset.asset.retired_status')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <TableContainer component={Paper}>
                    <Table size="small" aria-label="assets">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>{t('manager_asset.asset.image')}</TableCell>
                                <TableCell>{t('manager_asset.asset.name')}</TableCell>
                                <TableCell>{t('manager_asset.asset.description')}</TableCell>
                                <TableCell>{t('manager_asset.asset.serialNumber')}</TableCell>
                                <TableCell>{t('manager_asset.asset.status')}</TableCell>
                                <TableCell>{t('manager_asset.asset.purchase_date')}</TableCell>
                                <TableCell>{t('manager_asset.asset.price')}</TableCell>
                                <TableCell>{t('manager_asset.asset.category')}</TableCell>
                                <TableCell>{t('manager_asset.asset.location')}</TableCell>
                                <TableCell sx={{width: '1%'}}>{t('manager_asset.asset.assigned_user')}</TableCell>
                                <TableCell sx={{width: '10%'}}>{t('manager_asset.asset.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((asset, index) => {
                                const rowNumber = page * rowsPerPage + index + 1;
                                return (
                                    <TableRow key={asset.id}>
                                        <TableCell>{rowNumber}</TableCell>
                                        <TableCell>
                                            {asset.image ? (
                                                <Box
                                                    component="img"
                                                    src={asset.image}
                                                    alt={asset.name}
                                                    sx={{
                                                        width: 100,
                                                        height: 'auto',
                                                        borderRadius: 1,
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                'No Image'
                                            )}
                                        </TableCell>
                                        <TableCell>{asset.name}</TableCell>
                                        <TableCell>{asset.description}</TableCell>
                                        <TableCell>{asset.serialNumber}</TableCell>
                                        <TableCell>{asset.status}</TableCell>
                                        <TableCell>{format(new Date(asset.purchaseDate), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell>{asset.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            {categories.find(cat => cat.id === asset.categoryId)?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {locations.find(loc => loc.id === asset.locationId)?.name || 'N/A'}
                                        </TableCell>

                                        <TableCell>
                                            {asset.assignedUserId ? (
                                                <span>{asset.assignedUserName || 'N/A'}</span>
                                            ) : (
                                                'Unassigned'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                sx={{color: 'primary.main'}}  // Màu xanh
                                                size="small"
                                                onClick={() => handleOpenDialogEdit(asset)}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton
                                                sx={{color: 'error.main'}}  // Màu đỏ
                                                size="small"
                                                onClick={() => handleDeleteClick(asset.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={12} align="center">
                                        {t('manager_asset.asset.no_asset')}
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
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>{editAsset ? t('manager_asset.asset.update_title') : t('manager_asset.asset.create_title')}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            label={t('manager_asset.asset.name')}
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                            required
                            sx={{mt: 2}}
                        />
                        <TextField
                            label={t('manager_asset.asset.description')}
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{marginTop: 2}}
                        />
                        <TextField
                            label={t('manager_asset.asset.serialNumber')}
                            name="serialNumber"
                            value={form.serialNumber || generateSerialNumber()}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                            required
                            sx={{marginTop: 2}}
                        />
                        <FormControl fullWidth required sx={{marginTop: 2}}>
                            <InputLabel id="status-label">{t('manager_asset.asset.status')}</InputLabel>
                            <Select
                                labelId="status-label"
                                label="Status"
                                name="status"
                                value={form.status}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={Status.AVAILABLE}>{t('manager_asset.asset.available_status')}</MenuItem>
                                <MenuItem value={Status.IN_USE}>{t('manager_asset.asset.in_use_status')}</MenuItem>
                                <MenuItem value={Status.MAINTENANCE}>{t('manager_asset.asset.maintenance_status')}</MenuItem>
                                <MenuItem value={Status.RETIRED}>{t('manager_asset.asset.retired_status')}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label={t('manager_asset.asset.purchase_date')}
                            name="purchaseDate"
                            type="datetime-local"
                            value={form.purchaseDate}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{marginTop: 2}}
                        />
                        <TextField
                            label={t('manager_asset.asset.price')}
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            sx={{marginTop: 2}}
                            inputProps={{
                                min: 0,
                            }}
                        />
                        <FormControl fullWidth required sx={{marginTop: 2}}>
                            <InputLabel id="category-label">{t('manager_asset.asset.category')}</InputLabel>
                            <Select
                                labelId="category-label"
                                label="Category"
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="0">
                                    <em>{t('manager_asset.asset.category_item')}</em>
                                </MenuItem>
                                {categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required sx={{marginTop: 2}}>
                            <InputLabel id="location-label">{t('manager_asset.asset.location')}</InputLabel>
                            <Select
                                labelId="location-label"
                                label="Location"
                                name="locationId"
                                value={form.locationId}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="0">
                                    <em>{t('manager_asset.asset.location_item')}</em>
                                </MenuItem>
                                {locations.map(loc => (
                                    <MenuItem key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Thay thế trường Assigned User ID bằng UserSelect */}
                        <Box sx={{marginTop: 2}}>
                            <UserSelect
                                assignedUserId={form.assignedUserId}
                                setAssignedUserId={(id) => setForm((prev) => ({...prev, assignedUserId: id || 0}))}
                            />
                        </Box>
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            height="100%"
                            sx={{mt:2}}
                        >
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                            >
                                {t('manager_asset.asset.button_upload')}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {form.image && (
                                <Box mt={2} width="100%">
                                    <img
                                        src={form.image}
                                        alt={form.name}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            border: '1px solid #ccc',
                                            borderRadius: '12px',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} variant="outlined">
                    {t('manager_asset.asset.button_cancel')}
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    {t('manager_asset.asset.button_save')}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Dialog Delete Confirmation */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>{t('manager_asset.asset.dialog_title')}</DialogTitle>
            <DialogContent>
                <div>{t('manager_asset.asset.dialog_content')}</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDeleteDialog} variant="outlined">
                    {t('manager_asset.asset.button_cancel')}
                </Button>
                <Button onClick={handleConfirmDelete} variant="contained" color="error">
                    {t('manager_asset.asset.button_delete')}
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
}

export default AssetPage;
