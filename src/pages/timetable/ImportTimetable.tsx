import React, {useState, useCallback} from 'react';
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
import {Upload as UploadIcon, Close as CloseIcon} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import {importTimetable} from '../../state/timetable/thunk.ts';
import {useAppDispatch} from "../../state/store.ts";
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";


const Input = styled('input')({
    display: 'none',
});


const DragAndDropBox = styled(Box)(({theme}) => ({
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
    const {t} = useTranslation();
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

    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({...prev, open: false}));
    }, []);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

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
            setAlert({open: false, message: "", severity: "info"});

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
        <>
            <Helmet>
                <title>Import Timetable | Lab Management IT</title>
            </Helmet>
            <Box className="container mx-auto py-10 px-4">
                {/* Loading Indicator */}
                <LoadingIndicator open={loading}/>

                <Paper elevation={3} sx={{padding: 4, borderRadius: 2}}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        align="center"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: { xs: 1, sm: 2 },
                            letterSpacing: -0.5,
                        }}
                    >
                        {t("timetable.importTimetable.title")}
                    </Typography>

                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            mb: { xs: 2, sm: 3, md: 4 },
                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        }}
                    >
                        Select a file excel/csv to import
                    </Typography>


                    <Box
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        sx={{mt: 4}}
                    >
                        <DragAndDropBox>
                            <UploadIcon sx={{fontSize: 50, color: 'primary.main'}}/>
                            <Typography variant="h6" color="textSecondary" sx={{mt: 2}}>
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
                                    startIcon={<UploadIcon/>}
                                    sx={{mt: 2}}
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
                                    <CloseIcon/>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}

                    <Box className="flex items-center justify-center mt-4">
                        {loading ? (
                            <CircularProgress color="primary"/>
                        ) : (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                startIcon={<UploadIcon/>}
                                disabled={!selectedFile}
                                fullWidth
                                sx={{maxWidth: 200, mt: 5}}
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
        </>
    );
};

export default ImportTimetable;
