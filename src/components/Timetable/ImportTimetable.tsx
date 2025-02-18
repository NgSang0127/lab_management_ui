import React, { useState, useCallback } from 'react';
import {
    Button,
    CircularProgress,
    Box,
    Typography,
    Paper,
    Stack,
    IconButton,
    Tooltip,
    AlertColor,
} from '@mui/material';
import { Upload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { importTimetable } from '../../state/Timetable/Reducer.ts';
import { useAppDispatch } from "../../state/store.ts";
import LoadingIndicator from "../Support/LoadingIndicator"; // Nếu bạn có component này
import CustomAlert from "../Support/CustomAlert";
import {useTranslation} from "react-i18next"; // Nếu bạn có component này

// Styled input for file selection
const Input = styled('input')({
    display: 'none',
});

// Styled component for drag-and-drop area
const DragAndDropBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const ImportTimetable: React.FC = () => {
    const {t}=useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    const dispatch = useAppDispatch();

    // Handle closing the alert
    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    // Handle file selection via input
    const handleFileSelect = (file: File) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ];
        if (validTypes.includes(file.type)) {
            setSelectedFile(file);
        } else {
            setAlert({
                open: true,
                message: t('timetable.importTimetable.errors.format'),
                severity: 'warning',
            });
        }
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Prevent default behavior for drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Handle form submit
    const handleSubmit = async () => {
        if (!selectedFile) {
            setAlert({
                open: true,
                message: t('timetable.importTimetable.errors.file'),
                severity: 'error',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setLoading(true);
            setAlert({ open: false, message: "", severity: "info" });

            const resultAction = await dispatch(importTimetable(formData));

            if (importTimetable.fulfilled.match(resultAction)) {
                setAlert({
                    open: true,
                    message: t('timetable.importTimetable.success.import'),
                    severity: 'success',
                });
                setSelectedFile(null); // Reset file input
            } else if (importTimetable.rejected.match(resultAction)) {
                setAlert({
                    open: true,
                    message: t('timetable.importTimetable.errors.upload'),
                    severity: 'error',
                });
            }
        } catch (err) {
            setAlert({
                open: true,
                message: t('timetable.importTimetable.errors.unexpected'),
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="container mx-auto py-10 px-4">
            {/* Loading Indicator */}
            <LoadingIndicator open={loading} />

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('timetable.importTimetable.title')}
                </Typography>

                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{ mt: 4 }}
                >
                    <DragAndDropBox>
                        <UploadIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                        <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                            {t('timetable.importTimetable.title2')}
                        </Typography>
                        <label htmlFor="file-input">
                            <Input
                                accept=".xlsx,.xls"
                                id="file-input"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                color="primary"
                                startIcon={<UploadIcon />}
                                sx={{ mt: 2 }}
                            >
                                {t('timetable.importTimetable.choose_button')}
                            </Button>
                        </label>
                    </DragAndDropBox>
                </Box>

                {selectedFile && (
                    <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                        <Typography variant="body1">{selectedFile.name}</Typography>
                        <Tooltip title="Remove File">
                            <IconButton onClick={() => setSelectedFile(null)} color="error">
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}

                <Box className="flex items-center justify-center mt-4">
                    {loading ? (
                        <CircularProgress color="primary" />
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            startIcon={<UploadIcon />}
                            disabled={!selectedFile}
                            fullWidth
                            sx={{ maxWidth: 200,mt:5}}
                        >
                            {t('timetable.importTimetable.upload_button')}
                        </Button>
                    )}
                </Box>

                {alert.open && (
                    <CustomAlert
                        open={alert.open}
                        message={alert.message}
                        severity={alert.severity}
                        onClose={handleCloseAlert}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default ImportTimetable;
