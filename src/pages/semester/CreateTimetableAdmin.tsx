import React, { useState, useEffect } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, Checkbox, MenuItem, IconButton, Box, Typography, Tooltip,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import LoadingIndicator from '../../components/support/LoadingIndicator';
import CustomAlert from '../../components/support/CustomAlert';
import { createTimetableByAdmin } from '../../state/timetable/thunk.ts';
import { useAppDispatch } from '../../state/store.ts';
import { TimetableRequest } from '../../state/timetable/timetableSlice.ts';
import { CourseRequest } from '../../services/course/courseApi.ts';
import InstructorAutocomplete from "../../components/semester/InstructorAutocomplete.tsx";
import SemesterAutocomplete from "../../components/semester/SemesterAutocomplete.tsx";
import RoomAutocomplete from "../../components/semester/RoomAutocomplete.tsx";
import LessonTimeAutocomplete from '../../components/semester/LessonTimeAutocomplete.tsx';
import CourseAutocomplete from "../../components/semester/CourseAutocomplete.tsx";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { enGB } from 'date-fns/locale';

const CreateTimetableAdmin: React.FC = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState<TimetableRequest>({
        timetableName: '',
        semesterId: 0,
        instructorId: 0,
        dayOfWeek: '',
        roomId: 0,
        studyTime: '',
        startLessonTimeId: 0,
        endLessonTimeId: 0,
        cancelDates: [],
    });
    const [useCourses, setUseCourses] = useState(false);
    const [createNewCourse, setCreateNewCourse] = useState(false);
    const [newCourse, setNewCourse] = useState<CourseRequest>({
        name: '',
        code: '',
        nh: '',
        th: '',
        description: '',
        credits: 0,
        instructorId: 0,
    });
    const [selectedCourses, setSelectedCourses] = useState<CourseRequest[]>([]);

    const [ranges, setRanges] = useState<Array<{ startDate: Date | null; endDate: Date | null }>>([{ startDate: null, endDate: null }]);
    const [singleDates, setSingleDates] = useState<Array<Date | null>>([]);

    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

    const handleOpenDialogCreate = () => {
        setFormData({
            timetableName: '',
            semesterId: 0,
            instructorId: 0,
            dayOfWeek: '',
            roomId: 0,
            studyTime: '',
            startLessonTimeId: 0,
            endLessonTimeId: 0,
            cancelDates: [],
        });
        setUseCourses(false);
        setCreateNewCourse(false);
        setSelectedCourses([]);
        setNewCourse({
            name: '',
            code: '',
            nh: '',
            th: '',
            description: '',
            credits: 0,
            instructorId: 0,
        });
        setRanges([{ startDate: null, endDate: null }]);
        setSingleDates([]);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const formatStudyTime = (): string => {
        const formattedRanges = ranges
            .filter(range => range.startDate && range.endDate)
            .map(range => `${format(range.startDate!, 'dd/MM/yyyy')} - ${format(range.endDate!, 'dd/MM/yyyy')}`);
        const formattedSingles = singleDates
            .filter(date => date !== null)
            .map(date => format(date!, 'dd/MM/yyyy'));
        return [...formattedRanges, ...formattedSingles].join('\n');
    };

    useEffect(() => {
        const formattedStudyTime = formatStudyTime();
        setFormData({ ...formData, studyTime: formattedStudyTime });
    }, [ranges, singleDates]);

    const addRange = () => {
        setRanges([...ranges, { startDate: null, endDate: null }]);
    };

    const addSingleDate = () => {
        setSingleDates([...singleDates, null]);
    };

    const removeRange = (index: number) => {
        setRanges(ranges.filter((_, i) => i !== index));
    };

    const removeSingleDate = (index: number) => {
        setSingleDates(singleDates.filter((_, i) => i !== index));
    };

    const updateRange = (index: number, field: 'startDate' | 'endDate', value: Date | null) => {
        const newRanges = [...ranges];
        newRanges[index] = { ...newRanges[index], [field]: value };
        if (field === 'startDate' && value && newRanges[index].endDate && value > newRanges[index].endDate) {
            setError('Start date cannot be after end date.');
            return;
        }
        if (field === 'endDate' && value && newRanges[index].startDate && value < newRanges[index].startDate) {
            setError('End date cannot be before start date.');
            return;
        }
        setError(null);
        setRanges(newRanges);
    };

    const updateSingleDate = (index: number, value: Date | null) => {
        const newSingleDates = [...singleDates];
        newSingleDates[index] = value;
        setSingleDates(newSingleDates);
    };

    const handleSave = async () => {
        if (
            !formData.semesterId ||
            !formData.instructorId ||
            !formData.dayOfWeek ||
            !formData.roomId ||
            !formData.studyTime ||
            !formData.startLessonTimeId ||
            !formData.endLessonTimeId
        ) {
            setError('All required fields must be filled.');
            setSuccess(null);
            return;
        }
        if (!useCourses && !formData.timetableName) {
            setError('Timetable name is required.');
            setSuccess(null);
            return;
        }
        if (useCourses && createNewCourse && (
            !newCourse.name ||
            !newCourse.code ||
            !newCourse.nh ||
            !newCourse.th ||
            !newCourse.instructorId
        )) {
            setError('All course fields are required.');
            setSuccess(null);
            return;
        }
        if (useCourses && !createNewCourse && selectedCourses.length === 0) {
            setError('At least one course must be selected.');
            setSuccess(null);
            return;
        }
        if (!formData.studyTime) {
            setError('At least one valid range or single date is required.');
            setSuccess(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const request: TimetableRequest = { ...formData };
            if (useCourses) {
                request.timetableName = undefined;
                if (createNewCourse) {
                    request.courses = [newCourse];
                } else {
                    request.courses = selectedCourses.map(c => ({ id: c.id! }));
                }
            } else {
                request.courses = [];
            }

            await dispatch(createTimetableByAdmin(request)).unwrap();
            setSuccess('Timetable created successfully.');
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    const renderStudyTime = () => {
        const studyTime = formData.studyTime || '';
        return studyTime ? (
            studyTime.split('\n').map((time, index) => (
                <Typography key={`study-time-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                    {time}
                </Typography>
            ))
        ) : (
            <Typography variant="body2" color="text.secondary">
                No dates selected
            </Typography>
        );
    };

    return (
        <>
            <Helmet>
                <title>Create Timetable | Lab Management IT</title>
            </Helmet>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <div className="p-4">
                    {loading && <LoadingIndicator open={loading} />}

                    <Button variant="contained" color="primary" onClick={handleOpenDialogCreate}>
                        Create Timetable
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

                    {/* Dialog Create */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                        <DialogTitle>Create Timetable</DialogTitle>
                        <DialogContent className="space-y-4">
                            <Box>
                                <Tooltip title="Select this to associate the timetable with specific courses instead of a custom name">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={useCourses}
                                                onChange={(e) => {
                                                    setUseCourses(e.target.checked);
                                                    setFormData({ ...formData, timetableName: '' });
                                                    setSelectedCourses([]);
                                                    setCreateNewCourse(false);
                                                }}
                                            />
                                        }
                                        label="Use Courses"
                                    />
                                </Tooltip>
                                {useCourses && (
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                                        Enable this to link the timetable with existing courses or create a new course. You can select multiple courses or define a new one below.
                                    </Typography>
                                )}
                            </Box>
                            {!useCourses && (
                                <TextField
                                    label="Timetable Name"
                                    value={formData.timetableName}
                                    onChange={(e) => setFormData({ ...formData, timetableName: e.target.value })}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ marginTop: 2 }}
                                    placeholder="e.g., Introduction to Programming"
                                />
                            )}
                            {useCourses && (
                                <Box sx={{ ml: 4, mt: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                                    <Tooltip title="Create a new course if it doesn't exist in the system">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={createNewCourse}
                                                    onChange={(e) => {
                                                        setCreateNewCourse(e.target.checked);
                                                        setSelectedCourses([]);
                                                        setNewCourse({
                                                            name: '',
                                                            code: '',
                                                            nh: '',
                                                            th: '',
                                                            description: '',
                                                            credits: 0,
                                                            instructorId: 0,
                                                        });
                                                    }}
                                                />
                                            }
                                            label="Create New Course"
                                        />
                                    </Tooltip>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {createNewCourse
                                            ? "Fill in the details below to create a new course for this timetable."
                                            : "Select existing courses from the list below or create a new one."}
                                    </Typography>
                                    {!createNewCourse && (
                                        <CourseAutocomplete
                                            selectedCourses={selectedCourses}
                                            setSelectedCourses={(courses) => {
                                                setSelectedCourses(courses);
                                                setFormData({ ...formData, courses: courses.map(c => ({ id: c.id! })) });
                                            }}
                                        />
                                    )}
                                    {createNewCourse && (
                                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Typography variant="subtitle1">New Course Details</Typography>
                                            <TextField
                                                label="Course Name"
                                                value={newCourse.name}
                                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                                variant="outlined"
                                                fullWidth
                                                required
                                                placeholder="e.g., Advanced Java Programming"
                                            />
                                            <TextField
                                                label="Course Code"
                                                value={newCourse.code}
                                                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                                variant="outlined"
                                                fullWidth
                                                required
                                                placeholder="e.g., CS301"
                                            />
                                            <TextField
                                                label="Course NH (Lecture)"
                                                value={newCourse.nh}
                                                onChange={(e) => setNewCourse({ ...newCourse, nh: e.target.value })}
                                                variant="outlined"
                                                fullWidth
                                                required
                                                placeholder="e.g., 30 hours"
                                            />
                                            <TextField
                                                label="Course TH (Lab)"
                                                value={newCourse.th}
                                                onChange={(e) => setNewCourse({ ...newCourse, th: e.target.value })}
                                                variant="outlined"
                                                fullWidth
                                                required
                                                placeholder="e.g., 15 hours"
                                            />
                                            <InstructorAutocomplete
                                                selectedInstructorId={newCourse.instructorId || null}
                                                setSelectedInstructorId={(id) => setNewCourse({ ...newCourse, instructorId: id || 0 })}
                                            />
                                            <TextField
                                                label="Course Credits"
                                                type="number"
                                                value={newCourse.credits}
                                                onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                                                variant="outlined"
                                                fullWidth
                                                placeholder="e.g., 3"
                                            />
                                            <TextField
                                                label="Course Description"
                                                value={newCourse.description}
                                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder="e.g., This course covers advanced topics in Java programming..."
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                            <SemesterAutocomplete
                                selectedSemesterId={formData.semesterId || null}
                                setSelectedSemesterId={(id) => setFormData({ ...formData, semesterId: id || 0 })}
                            />
                            <InstructorAutocomplete
                                selectedInstructorId={formData.instructorId || null}
                                setSelectedInstructorId={(id) => setFormData({ ...formData, instructorId: id || 0 })}
                            />
                            <TextField
                                select
                                label="Day of Week"
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                variant="outlined"
                                fullWidth
                                required
                            >
                                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                                    <MenuItem key={day} value={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <RoomAutocomplete
                                selectedRoomId={formData.roomId || null}
                                setSelectedRoomId={(id) => setFormData({ ...formData, roomId: id || 0 })}
                            />
                            <LessonTimeAutocomplete
                                label="Start Lesson Time"
                                selectedLessonTimeId={formData.startLessonTimeId || null}
                                setSelectedLessonTimeId={(id) => setFormData({ ...formData, startLessonTimeId: id || 0 })}
                            />
                            <LessonTimeAutocomplete
                                label="End Lesson Time"
                                selectedLessonTimeId={formData.endLessonTimeId || null}
                                setSelectedLessonTimeId={(id) => setFormData({ ...formData, endLessonTimeId: id || 0 })}
                            />
                            {/* Interface for studyTime */}
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>Study Time</Typography>
                                {/* Ranges */}
                                {ranges.map((range, index) => (
                                    <Box key={index} display="flex" alignItems="center" mb={2}>
                                        <DatePicker
                                            label="Start Date"
                                            value={range.startDate}
                                            onChange={(newValue) => updateRange(index, 'startDate', newValue)}
                                            format="dd/MM/yyyy"
                                            slotProps={{ textField: { variant: 'outlined', sx: { mr: 1, width: '45%' }, required: true } }}
                                        />
                                        <DatePicker
                                            label="End Date"
                                            value={range.endDate}
                                            onChange={(newValue) => updateRange(index, 'endDate', newValue)}
                                            format="dd/MM/yyyy"
                                            slotProps={{ textField: { variant: 'outlined', sx: { mr: 1, width: '45%' }, required: true } }}
                                        />
                                        <IconButton color="error" onClick={() => removeRange(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={addRange} sx={{ mb: 2 }}>
                                    Add Range
                                </Button>
                                {/* Single Dates */}
                                {singleDates.map((date, index) => (
                                    <Box key={index} display="flex" alignItems="center" mb={2}>
                                        <DatePicker
                                            label="Single Date"
                                            value={date}
                                            onChange={(newValue) => updateSingleDate(index, newValue)}
                                            format="dd/MM/yyyy"
                                            slotProps={{ textField: { variant: 'outlined', sx: { mr: 1, width: '45%' }, required: true } }}
                                        />
                                        <IconButton color="error" onClick={() => removeSingleDate(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={addSingleDate} sx={{ mb: 2 }}>
                                    Add Single Date
                                </Button>
                                {/* Display selected studyTime */}
                                <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Selected Study Time:</Typography>
                                    {renderStudyTime()}
                                </Box>
                            </Box>
                            <TextField
                                label="Cancel Dates"
                                value={formData.cancelDates?.join(',') || ''}
                                onChange={(e) => {
                                    const dates = e.target.value
                                        .split(',')
                                        .map(date => date.trim())
                                        .filter(date => date);
                                    setFormData({ ...formData, cancelDates: dates });
                                }}
                                variant="outlined"
                                fullWidth
                                placeholder="e.g., 10/10/2024, 15/10/2024"
                            />
                            <TextField
                                label="Class ID"
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                variant="outlined"
                                fullWidth
                                placeholder="e.g., CS101-A"
                            />
                            <TextField
                                label="Number of Students"
                                type="number"
                                value={formData.numberOfStudents}
                                onChange={(e) => setFormData({ ...formData, numberOfStudents: Number(e.target.value) })}
                                variant="outlined"
                                fullWidth
                                placeholder="e.g., 30"
                            />
                            <TextField
                                label="Total Lessons per Semester"
                                type="number"
                                value={formData.totalLessonSemester}
                                onChange={(e) => setFormData({ ...formData, totalLessonSemester: Number(e.target.value) })}
                                variant="outlined"
                                fullWidth
                                placeholder="e.g., 15"
                            />
                            <TextField
                                label="Total Lessons per Day"
                                type="number"
                                value={formData.totalLessonDay}
                                onChange={(e) => setFormData({ ...formData, totalLessonDay: Number(e.target.value) })}
                                variant="outlined"
                                fullWidth
                                placeholder="e.g., 2"
                            />
                            <TextField
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="e.g., This timetable is for the first semester of the academic year..."
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} variant="outlined">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} variant="contained" color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </LocalizationProvider>
        </>
    );
};

export default CreateTimetableAdmin;