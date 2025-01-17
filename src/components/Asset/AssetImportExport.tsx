// src/components/AssetImportExport.tsx

import React, { useState, useCallback } from "react";
import {
    Button,
    Box,
    Typography,
    Paper,
    Stack,
    IconButton,
    Tooltip,
    AlertColor,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Upload as UploadIcon, Download as DownloadIcon, Close as CloseIcon } from "@mui/icons-material";
import { importAssetsFromCSV, importAssetsFromExcel, exportAssetsToCSV, exportAssetsToExcel } from "../../api/asset/importexportApi";
import LoadingIndicator from "../Support/LoadingIndicator";
import CustomAlert from "../Support/CustomAlert";
import { styled } from '@mui/material/styles';

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

const AssetImportExport: React.FC = () => {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "info",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle closing the alert
    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    // Handle importing CSV
    const handleImportCSV = useCallback(async () => {
        if (!csvFile) return;
        setIsLoading(true);
        try {
            const response = await importAssetsFromCSV(csvFile);
            setAlert({
                open: true,
                message: response,
                severity: "success",
            });
            setCsvFile(null); // Reset file input
        } catch (error: any) {
            setAlert({
                open: true,
                message: error.message || "An error occurred while importing CSV.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [csvFile]);

    // Handle importing Excel
    const handleImportExcel = useCallback(async () => {
        if (!excelFile) return;
        setIsLoading(true);
        try {
            const response = await importAssetsFromExcel(excelFile);
            setAlert({
                open: true,
                message: response,
                severity: "success",
            });
            setExcelFile(null); // Reset file input
        } catch (error: any) {
            setAlert({
                open: true,
                message: error.message || "An error occurred while importing Excel.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [excelFile]);

    // Handle exporting CSV
    const handleExportCSV = useCallback(async () => {
        setIsLoading(true);
        try {
            const { blob, filename } = await exportAssetsToCSV();
            const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            setAlert({
                open: true,
                message: "CSV export successful!",
                severity: "success",
            });
        } catch (error: any) {
            setAlert({
                open: true,
                message: error.message || "An error occurred while exporting CSV.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle exporting Excel
    const handleExportExcel = useCallback(async () => {
        setIsLoading(true);
        try {
            const { blob, filename } = await exportAssetsToExcel();
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            setAlert({
                open: true,
                message: "Excel export successful!",
                severity: "success",
            });
        } catch (error: any) {
            setAlert({
                open: true,
                message: error.message || "An error occurred while exporting Excel.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle drag-and-drop for CSV
    const handleDropCSV = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "text/csv") {
                setCsvFile(file);
            } else {
                setAlert({
                    open: true,
                    message: "Please drop a valid CSV file.",
                    severity: "warning",
                });
            }
        }
    };

    // Handle drag-and-drop for Excel
    const handleDropExcel = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
                setExcelFile(file);
            } else {
                setAlert({
                    open: true,
                    message: "Please drop a valid Excel file.",
                    severity: "warning",
                });
            }
        }
    };

    // Prevent default behavior for drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <Box p={3}>
            {/* Loading Indicator */}
            <LoadingIndicator open={isLoading} />

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h2" gutterBottom align="center" className="pb-10">
                    Asset Import and Export
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {/* Import CSV */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="h6" gutterBottom>
                            Import from CSV
                        </Typography>
                        <DragAndDropBox
                            onDrop={handleDropCSV}
                            onDragOver={handleDragOver}
                        >
                            <Typography variant="body1" color="textSecondary">
                                Drag and drop a CSV file here, or click to select a file
                            </Typography>
                            <label htmlFor="csv-file-input">
                                <Input
                                    accept=".csv"
                                    id="csv-file-input"
                                    type="file"
                                    onChange={(e) => e.target.files && setCsvFile(e.target.files[0])}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    startIcon={<UploadIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Choose CSV File
                                </Button>
                            </label>
                        </DragAndDropBox>
                        {csvFile && (
                            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                                <Typography variant="body1">{csvFile.name}</Typography>
                                <Tooltip title="Remove File">
                                    <IconButton onClick={() => setCsvFile(null)} color="error">
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleImportCSV}
                            disabled={!csvFile}
                            startIcon={<UploadIcon />}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Import CSV
                        </Button>
                    </Grid>

                    {/* Import Excel */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="h6" gutterBottom>
                            Import from Excel
                        </Typography>
                        <DragAndDropBox
                            onDrop={handleDropExcel}
                            onDragOver={handleDragOver}
                        >
                            <Typography variant="body1" color="textSecondary">
                                Drag and drop an Excel file here, or click to select a file
                            </Typography>
                            <label htmlFor="excel-file-input">
                                <Input
                                    accept=".xlsx,.xls"
                                    id="excel-file-input"
                                    type="file"
                                    onChange={(e) => e.target.files && setExcelFile(e.target.files[0])}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    startIcon={<UploadIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Choose Excel File
                                </Button>
                            </label>
                        </DragAndDropBox>
                        {excelFile && (
                            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                                <Typography variant="body1">{excelFile.name}</Typography>
                                <Tooltip title="Remove File">
                                    <IconButton onClick={() => setExcelFile(null)} color="error">
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleImportExcel}
                            disabled={!excelFile}
                            startIcon={<UploadIcon />}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Import Excel
                        </Button>
                    </Grid>

                    {/* Export CSV */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="h6" gutterBottom>
                            Export to CSV
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleExportCSV}
                            startIcon={<DownloadIcon />}
                            fullWidth
                        >
                            Export CSV
                        </Button>
                    </Grid>

                    {/* Export Excel */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="h6" gutterBottom>
                            Export to Excel
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleExportExcel}
                            startIcon={<DownloadIcon />}
                            fullWidth
                        >
                            Export Excel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Custom Alert */}
            <CustomAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={handleCloseAlert}
            />
        </Box>
    );

};

export default AssetImportExport;
