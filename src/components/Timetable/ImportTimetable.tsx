import React, { useState } from 'react';
import { Button, CircularProgress, TextField, Box, Typography, Alert } from '@mui/material';
import { importTimetable } from '../../state/Timetable/Reducer.ts';
import {useAppDispatch} from "../../state/store.ts";

const ImportTimetable: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setFeedbackMessage('Please select a file first!');
            setError(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setLoading(true);
            setFeedbackMessage(null);
            setError(false);


            const resultAction: any = await dispatch(importTimetable(formData));

            if (importTimetable.fulfilled.match(resultAction)) {
                setFeedbackMessage('File imported successfully');
                setError(false);
            } else if (importTimetable.rejected.match(resultAction)) {
                setFeedbackMessage('Error uploading file. Please try again.');
                setError(true);
            }
        } catch (err) {
            setFeedbackMessage('An unknown error occurred');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="container mx-auto py-20 px-4">
            <Typography variant="h4" className="text-center mb-6 text-gray-800 font-semibold">
                Import Timetable
            </Typography>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <TextField
                        fullWidth
                        type="file"
                        onChange={handleFileChange}
                        helperText="Please upload an Excel file (.xlsx or .xls)"
                        variant="outlined"
                    />
                </div>

                <Box className="flex items-center justify-between">
                    {loading ? (
                        <CircularProgress color="primary" />
                    ) : (
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="bg-blue-500 hover:bg-blue-700"
                        >
                            Upload Timetable
                        </Button>
                    )}
                </Box>

                {feedbackMessage && (
                    <Box mt={4}>
                        {error ? (
                            <Alert severity="error">{feedbackMessage}</Alert>
                        ) : (
                            <Alert severity="success">{feedbackMessage}</Alert>
                        )}
                    </Box>
                )}
            </form>
        </Box>
    );
};

export default ImportTimetable;
