import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox,
    TextField, Typography, Grid, FormControl, InputLabel, Select, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, MenuItem, Chip, IconButton,
    ListItemText,
} from '@mui/material';
import {
    DataGrid, GridColDef, GridRenderCellParams, GridRowsProp, GridValueGetter, GridCellParams,
    GridSortModel, GridToolbar,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../components/support/CustomAlert';
import { CustomNoRowsOverlay } from '../../components/support/CustomNoRowsOverlay';
import debounce from 'lodash.debounce';
import InstructorAutocomplete from '../../components/semester/InstructorAutocomplete';
import RoomAutocomplete from '../../components/semester/RoomAutocomplete';
import LessonTimeAutocomplete from '../../components/semester/LessonTimeAutocomplete';
import CourseAutocomplete from '../../components/semester/CourseAutocomplete';
import { Semester, TimetableRequest } from '../../state/timetable/timetableSlice';
import { CourseRequest } from '../../services/course/courseApi';
import { fetchRooms, RoomResponse } from '../../services/asset/roomApi';
import { deleteTimetable, getTimetables, updateTimetable } from '../../state/timetable/thunk';
import { useAppDispatch } from '../../state/store';
import { LessonTime } from '../../state/lessonTime/lessonTimeSlice';
import { User } from '../../state/auth/authSlice';
import CreateTimetableAdmin from "./CreateTimetableAdmin.tsx";
import { SelectChangeEvent } from '@mui/material/Select';
import {fetchSemesters} from "../../services/semester/semesterApi.ts";

interface Instructor {
    id: number;
    instructorId: string;
    department: string;
    user: User;
}

interface TimetableDTO {
    id: number;
    timetableName: string | null;
    semester: Semester;
    instructor: Instructor;
    dayOfWeek: string;
    room: RoomResponse;
    numberOfStudents: number;
    startLesson: number;
    totalLessonSemester: number;
    totalLessonDay: number;
    classId: string;
    studyTime: string;
    startLessonTime: LessonTime;
    endLessonTime: LessonTime;
    description: string | null;
    courses: CourseRequest[];
    cancelDates: string[];
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const TimetableManager: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Local state
    const [timetables, setTimetables] = useState<TimetableDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [keyword, setKeyword] = useState('');
    const [roomFilter, setRoomFilter] = useState('');
    const [semesterIds, setSemesterIds] = useState<number[]>([]);
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editTimetable, setEditTimetable] = useState<TimetableDTO | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedTimetable, setSelectedTimetable] = useState<TimetableDTO | null>(null);

    // Form state for edit
    const [formData, setFormData] = useState<{
        id: number;
        timetableName: string | null;
        semesterId: number;
        semester: Semester;
        instructorId: number;
        instructor: Instructor;
        dayOfWeek: string;
        roomId: number;
        room: RoomResponse;
        studyTime: string;
        startLessonTimeId: number;
        startLessonTime: LessonTime;
        endLessonTimeId: number;
        endLessonTime: LessonTime;
        numberOfStudents: number;
        startLesson: number;
        totalLessonSemester: number;
        totalLessonDay: number;
        classId: string;
        cancelDates: string[];
        description: string | null;
        courses: CourseRequest[];
        enrollments: any[];
    }>({
        id: 0,
        timetableName: null,
        semesterId: 0,
        semester: { id: 0, name: '', academicYear: '', startDate: '', endDate: '' },
        instructorId: 0,
        instructor: {
            id: 0,
            instructorId: '',
            department: '',
            user: {
                id: 0,
                firstName: '',
                lastName: '',
                username: '',
                phoneNumber: null,
                email: null,
                role: '',
                twoFactorEnabled: false,
                accountLocked: false,
                enabled: false,
                createdDate: '',
                lastModifiedDate: null,
                image: null,
                name: '',
                fullName: '',
                authorities: [],
                accountNonExpired: true,
                credentialsNonExpired: true,
                accountNonLocked: true,
            },
        },
        dayOfWeek: '',
        roomId: 0,
        room: { id: 0, name: '', location: '', capacity: 0 },
        studyTime: '',
        startLessonTimeId: 0,
        startLessonTime: { id: 0, lessonNumber: 0, startTime: '', endTime: '', session: '' },
        endLessonTimeId: 0,
        endLessonTime: { id: 0, lessonNumber: 0, startTime: '', endTime: '', session: '' },
        numberOfStudents: 0,
        startLesson: 0,
        totalLessonSemester: 0,
        totalLessonDay: 0,
        classId: '',
        cancelDates: [],
        description: null,
        courses: [],
        enrollments: [],
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


    // Fetch data
    const debouncedFetchData = useMemo(
        () =>
            debounce(
                (
                    currentPage: number,
                    currentPageSize: number,
                    currentKeyword: string,
                    currentRoomFilter: string,
                    currentSemesterIds: number[],
                    currentSortModel: GridSortModel
                ) => {
                    fetchData(
                        currentPage,
                        currentPageSize,
                        currentKeyword,
                        currentRoomFilter,
                        currentSemesterIds,
                        currentSortModel
                    );
                },
                600
            ),
        []
    );

    const fetchData = async (
        currentPage: number,
        currentPageSize: number,
        currentKeyword: string,
        currentRoomName: string,
        currentSemesterIds: number[],
        currentSortModel: GridSortModel
    ) => {
        try {
            setLoading(true);
            setError(null);
            const sortField = currentSortModel[0]?.field || 'id';
            const sortDirection = currentSortModel[0]?.sort || 'asc';
            const action = await dispatch(getTimetables({
                page: currentPage,
                size: currentPageSize,
                keyword: currentKeyword,
                roomName: currentRoomName,
                semesterIds: currentSemesterIds.join(','),
                sortBy: sortField,
                sortOrder: sortDirection,
            }));
            const response = action.payload as { content: TimetableDTO[]; totalElements: number };
            if (response.content && response.totalElements !== undefined) {
                const validTimetables = response.content.filter(timetable => timetable.id != null);
                const invalidCount = response.content.length - validTimetables.length;
                if (invalidCount > 0) {
                    console.warn(`Filtered out ${invalidCount} timetables due to missing 'id' property.`);
                    setError(`Filtered out ${invalidCount} timetables due to missing 'id' property.`);
                }
                const formattedTimetables = validTimetables.map((timetable) => ({
                    ...timetable,
                    cancelDates: timetable.cancelDates?.map((date) =>
                        new Date(date).toLocaleDateString('en-GB').split('/').join('/')
                    ) || [],
                }));
                setTimetables(formattedTimetables);
                setTotalElements(response.totalElements);
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectData = async () => {
        try {
            const roomsRes = await fetchRooms(0, 50);
            if (roomsRes.content) setRooms(roomsRes.content);
            const semestersRes = await fetchSemesters(0, 10);
            if (semestersRes.content) setSemesters(semestersRes.content);
        } catch (err) {
            console.error('Error fetching select data:', err);
        }
    };

    useEffect(() => {
        debouncedFetchData(page, pageSize, keyword, roomFilter, semesterIds, sortModel);
        fetchSelectData();
        return () => debouncedFetchData.cancel();
    }, [page, pageSize, keyword, roomFilter, semesterIds, sortModel, debouncedFetchData]);

    const handleSemesterFilterChange = (event: SelectChangeEvent<number[]>) => {
        const value = event.target.value as number[];
        setSemesterIds(value);
        setPage(0);
    };

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        if (newSortModel.length > 0) {
            const currentField = newSortModel[0].field;
            const previousSort = sortModel[0]?.field === currentField ? sortModel[0]?.sort : null;
            if (!previousSort || previousSort === 'asc') {
                setSortModel([{ field: currentField, sort: 'desc' }]);
            } else if (previousSort === 'desc') {
                setSortModel([]);
            }
        } else {
            setSortModel(newSortModel);
        }
        setPage(0);
    };
    const handleOpenDialogEdit = (timetable: TimetableDTO) => {
        console.log('Timetable Data:', JSON.stringify(timetable, null, 2));

        const semesterId = timetable.semester?.id || 0;
        const instructorId = timetable.instructor?.id || 0;
        const roomId = timetable.room?.id || 0;
        const startLessonTimeId = timetable.startLessonTime?.id || 0;
        const endLessonTimeId = timetable.endLessonTime?.id || 0;
        const courseIds = timetable.courses?.map(c => c.id) || [];

        console.log('IDs for Autocomplete:', {
            semesterId,
            instructorId,
            roomId,
            startLessonTimeId,
            endLessonTimeId,
            courseIds,
        });

        setEditTimetable(timetable);
        setFormData({
            id: timetable.id || 0,
            timetableName: timetable.timetableName || null,
            semesterId,
            semester: timetable.semester || { id: 0, name: '', academicYear: '', startDate: '', endDate: '' },
            instructorId,
            instructor: timetable.instructor || {
                id: 0,
                instructorId: '',
                department: '',
                user: {
                    id: 0,
                    firstName: '',
                    lastName: '',
                    username: '',
                    phoneNumber: null,
                    email: null,
                    role: '',
                    twoFactorEnabled: false,
                    accountLocked: false,
                    enabled: false,
                    createdDate: '',
                    lastModifiedDate: null,
                    image: null,
                    name: '',
                    fullName: '',
                    authorities: [],
                    accountNonExpired: true,
                    credentialsNonExpired: true,
                    accountNonLocked: true,
                },
            },
            dayOfWeek: timetable.dayOfWeek || '',
            roomId,
            room: timetable.room || { id: 0, name: '', location: '', capacity: 0 },
            studyTime: timetable.studyTime || '',
            startLessonTimeId,
            startLessonTime: timetable.startLessonTime || { id: 0, lessonNumber: 0, startTime: '', endTime: '', session: '' },
            endLessonTimeId,
            endLessonTime: timetable.endLessonTime || { id: 0, lessonNumber: 0, startTime: '', endTime: '', session: '' },
            numberOfStudents: timetable.numberOfStudents || 0,
            startLesson: timetable.startLesson || 0,
            totalLessonSemester: timetable.totalLessonSemester || 0,
            totalLessonDay: timetable.totalLessonDay || 0,
            classId: timetable.classId || '',
            cancelDates: timetable.cancelDates || [],
            description: timetable.description || null,
            courses: timetable.courses || [],
            enrollments: [],
        });
        setUseCourses(!!timetable.courses && timetable.courses.length > 0);
        setCreateNewCourse(false);
        setSelectedCourses(timetable.courses || []);
        setNewCourse({
            name: '',
            code: '',
            nh: '',
            th: '',
            description: '',
            credits: 0,
            instructorId: 0,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditTimetable(null);
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
        setFormData({
            id: 0,
            timetableName: null,
            semesterId: 0,
            semester: { id: 0, name: '', academicYear: '', startDate: '', endDate: '' },
            instructorId: 0,
            instructor: {
                id: 0,
                instructorId: '',
                department: '',
                user: {
                    id: 0,
                    firstName: '',
                    lastName: '',
                    username: '',
                    phoneNumber: null,
                    email: null,
                    role: '',
                    twoFactorEnabled: false,
                    accountLocked: false,
                    enabled: false,
                    createdDate: '',
                    lastModifiedDate: null,
                    image: null,
                    name: '',
                    fullName: '',
                    authorities: [],
                    accountNonExpired: true,
                    credentialsNonExpired: true,
                    accountNonLocked: true,
                },
            },
            dayOfWeek: '',
            roomId: 0,
            room: { id: 0, name: '', location: '', capacity: 0 },
            studyTime: '',
            startLessonTimeId: 0,
            startLessonTime: { id: 0, lessonNumber: 0, startTime: '', endTime: '', session: '' },
            endLessonTimeId: 0,
            endLessonTime: { id: 0, lessonNumber: 0, startTime: '', endTime: '', session: '' },
            numberOfStudents: 0,
            startLesson: 0,
            totalLessonSemester: 0,
            totalLessonDay: 0,
            classId: '',
            cancelDates: [],
            description: null,
            courses: [],
            enrollments: [],
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        if (['numberOfStudents', 'totalLessonSemester', 'totalLessonDay', 'startLesson'].includes(name)) {
            const numericValue = Number(value);
            if (numericValue < 0) return;
            setFormData((prev) => ({ ...prev, [name]: numericValue }));
        } else if (name === 'cancelDates') {
            setFormData((prev) => ({ ...prev, cancelDates: value.split(',').map(d => d.trim()).filter(d => d) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (
            formData.semesterId === 0 ||
            formData.instructorId === 0 ||
            !formData.dayOfWeek ||
            formData.roomId === 0 ||
            !formData.studyTime ||
            formData.startLessonTimeId === 0 ||
            formData.endLessonTimeId === 0
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
            newCourse.instructorId === 0
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

        const isValidDate = (date: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(date);
        const isValidStudyTime = (time: string) => /^\d{2}\/\d{2}\/\d{4}\s*-\s*\d{2}\/\d{2}\/\d{4}(\n\d{2}\/\d{2}\/\d{4}\s*-\s*\d{2}\/\d{2}\/\d{4})?$/.test(time);
        if (!isValidStudyTime(formData.studyTime)) {
            setError('Invalid study time format.');
            setSuccess(null);
            return;
        }
        if (formData.cancelDates?.some(date => !isValidDate(date))) {
            setError('Invalid date format in cancel dates.');
            setSuccess(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const request: TimetableRequest = {
                timetableName: formData.timetableName,
                semesterId: formData.semesterId,
                instructorId: formData.instructorId,
                dayOfWeek: formData.dayOfWeek,
                roomId: formData.roomId,
                studyTime: formData.studyTime,
                startLessonTimeId: formData.startLessonTimeId,
                endLessonTimeId: formData.endLessonTimeId,
                numberOfStudents: formData.numberOfStudents,
                totalLessonSemester: formData.totalLessonSemester,
                totalLessonDay: formData.totalLessonDay,
                classId: formData.classId,
                cancelDates: formData.cancelDates,
                description: formData.description,
                courses: [],
            };
            if (useCourses) {
                request.timetableName = undefined;
                if (createNewCourse) {
                    request.courses = [{ ...newCourse, instructorId: newCourse.instructorId! }];
                } else {
                    request.courses = selectedCourses.map(c => ({
                        id: c.id,
                    }));
                }
            } else {
                request.courses = [];
            }

            if (editTimetable) {
                await dispatch(updateTimetable({ id: editTimetable.id, request })).unwrap();
                setSuccess('Timetable updated successfully.');
            }
            await fetchData(page, pageSize, keyword, roomFilter, semesterIds, sortModel);
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
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
                await dispatch(deleteTimetable(deleteId)).unwrap();
                setSuccess('Timetable deleted successfully.');
                await fetchData(page, pageSize, keyword, roomFilter, semesterIds, sortModel);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
                setSuccess(null);
            } finally {
                setLoading(false);
                handleCloseDeleteDialog();
            }
        }
    };

    const handleOpenDetails = (timetable: TimetableDTO) => {
        setSelectedTimetable(timetable);
        setOpenDetailsDialog(true);
    };

    const handleCloseDetails = () => {
        setOpenDetailsDialog(false);
        setSelectedTimetable(null);
    };

    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

    const columns: GridColDef<TimetableDTO>[] = [
        {
            field: 'id',
            headerName: 'No.',
            width: isMobile ? 50 : 70,
            valueGetter: ((value, row) => {
                if (!row || !row.id) return '-';
                const index = timetables.findIndex((item) => item.id === row.id);
                return index >= 0 ? index + 1 + page * pageSize : '-';
            }) as GridValueGetter<TimetableDTO>,
            sortable: true,
            filterable: false,
            resizable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'timetableName',
            headerName: 'Timetable Name',
            width: isMobile ? 100 : 150,
            sortable: true,
            cellClassName: 'clickable-cell',
            valueGetter: ((value) => value || 'Not name') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'semester',
            headerName: 'Semester',
            width: isMobile ? 100 : 150,
            sortable: false,
            valueGetter: ((value, row) => row.semester?.name || 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'dayOfWeek',
            headerName: 'Day of Week',
            width: isMobile ? 100 : 120,
            sortable: true,
            valueGetter: ((value) => value || 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'courses',
            headerName: 'Courses',
            width: isMobile ? 150 : 250,
            sortable: false,
            valueGetter: ((value, row) => {
                const courses = row.courses || [];
                return courses.length > 0
                    ? courses.map(c => `${c.name || 'N/A'} (${c.nh || 'N/A'}, ${c.th || 'N/A'})`).join(', ')
                    : 'N/A';
            }) as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'instructor',
            headerName: 'Instructor',
            width: isMobile ? 120 : 150,
            sortable: false,
            valueGetter: ((value, row) => row.instructor?.user?.fullName || 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'room',
            headerName: 'Room',
            width: isMobile ? 100 : 120,
            sortable: false,
            valueGetter: ((value, row) => row.room?.name || 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'startLessonTime',
            headerName: 'Start Lesson',
            width: isMobile ? 120 : 200,
            sortable: false,
            renderCell: (params: GridRenderCellParams<TimetableDTO>) => {
                const { startLessonTime } = params.row;
                return startLessonTime ? (
                    <Chip
                        label={`Lesson ${startLessonTime.lessonNumber} (${startLessonTime.startTime})`}
                        color="success"
                        size={isMobile ? 'small' : 'medium'}
                    />
                ) : (
                    <Chip label="N/A" color="default" size={isMobile ? 'small' : 'medium'} />
                );
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'endLessonTime',
            headerName: 'End Lesson',
            width: isMobile ? 120 : 200,
            sortable: false,
            renderCell: (params: GridRenderCellParams<TimetableDTO>) => {
                const { endLessonTime } = params.row;
                return endLessonTime ? (
                    <Chip
                        label={`Lesson ${endLessonTime.lessonNumber} (${endLessonTime.endTime})`}
                        color="success"
                        size={isMobile ? 'small' : 'medium'}
                    />
                ) : (
                    <Chip label="N/A" color="default" size={isMobile ? 'small' : 'medium'} />
                );
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'studyTime',
            headerName: 'Study Time',
            width: isMobile ? 150 : 200,
            sortable: false,
            renderCell: (params: GridRenderCellParams<TimetableDTO>) => {
                const studyTime = params.row.studyTime;
                if (!studyTime) {
                    return 'N/A';
                }
                const ranges = studyTime
                    .split('\n')
                    .filter(Boolean)
                    .map(range => range.trim())
                    .join('\n');
                return (
                    <Box
                        sx={{
                            whiteSpace: 'pre-line',
                            textAlign: 'center',
                            lineHeight: 1.5,
                            minHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {ranges || 'N/A'}
                    </Box>
                );
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'numberOfStudents',
            headerName: 'Students',
            width: isMobile ? 70 : 100,
            sortable: true,
            type: 'number',
            valueGetter: ((value) => value ?? 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'totalLessonDay',
            headerName: 'Lessons per Day',
            width: isMobile ? 70 : 100,
            sortable: true,
            type: 'number',
            valueGetter: ((value) => value ?? 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'totalLessonSemester',
            headerName: 'Lessons per Semester',
            width: isMobile ? 100 : 120,
            sortable: true,
            type: 'number',
            valueGetter: ((value) => value ?? 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'classId',
            headerName: 'Class ID',
            width: isMobile ? 100 : 120,
            sortable: true,
            valueGetter: ((value) => value || 'N/A') as GridValueGetter<TimetableDTO>,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cancelDates',
            headerName: 'Cancel Dates',
            width: isMobile ? 150 : 200,
            sortable: false,
            renderCell: (params: GridRenderCellParams<TimetableDTO>) => {
                const cancelDates = params.row.cancelDates || [];
                return cancelDates.length > 0 ? (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {cancelDates.map((date, index) => (
                            <Box key={index}>{date}</Box>
                        ))}
                    </Box>
                ) : (
                    'No cancel dates'
                );
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: isMobile ? 150 : 200,
            resizable: false,
            renderCell: (params: GridRenderCellParams<TimetableDTO>) => (
                <>
                    <IconButton
                        sx={{ color: 'primary.main' }}
                        size="small"
                        onClick={() => handleOpenDialogEdit(params.row )}
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
            align: 'center',
            headerAlign: 'center',
        },
    ];

    return (
        <Box>
            <Helmet>
                <title>Timetable Manager | Lab Management IT</title>
            </Helmet>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" mb={3}>
                Timetable Manager
            </Typography>
            <Box display="flex" gap={2} mb={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <CreateTimetableAdmin />
            </Box>
            <CustomAlert open={!!error} message={error || ''} severity="error" onClose={handleCloseError} />
            <CustomAlert open={!!success} message={success || ''} severity="success" onClose={handleCloseSuccess} />

            <Box mt={3}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            label="Search"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            variant="outlined"
                            fullWidth
                            placeholder="Search by timetable name"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 1,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ minWidth: { xs: '100%', sm: 120 }, maxWidth: { xs: '100%', sm: 200 } }}
                            >
                                <InputLabel>Filter by Room</InputLabel>
                                <Select
                                    value={roomFilter}
                                    onChange={(e) => {
                                        setRoomFilter(e.target.value as string);
                                        setPage(0);
                                    }}
                                    label="Filter by Room"
                                    sx={{ borderRadius: 10 }}
                                >
                                    <MenuItem value="">
                                        <em>All Rooms</em>
                                    </MenuItem>
                                    {rooms.map((room) => (
                                        <MenuItem key={room.id} value={room.name}>
                                            {room.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ minWidth: { xs: '100%', sm: 160 }, maxWidth: { xs: '100%', sm: 200 } }}
                            >
                                <InputLabel>Filter by Semester</InputLabel>
                                <Select
                                    multiple
                                    value={semesterIds}
                                    onChange={handleSemesterFilterChange}
                                    label="Filter by Semester"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((id) => (
                                                <Chip
                                                    key={id}
                                                    label={semesters.find((sem) => sem.id === id)?.name || id}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    sx={{ borderRadius: 10 }}
                                >
                                    {semesters.map((semester) => (
                                        <MenuItem key={semester.id} value={semester.id}>
                                            <Checkbox checked={semesterIds.includes(semester.id)} />
                                            <ListItemText primary={semester.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 3, height: { xs: 'auto', md: '1000px' } }}>
                <DataGrid
                    autosizeOptions={{
                        columns: ['timetableName', 'description'],
                        includeOutliers: true,
                        includeHeaders: false,
                    }}
                    rows={timetables as GridRowsProp}
                    columnHeaderHeight={isMobile ? 48 : 56}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    rowHeight={isMobile ? 70 : 86}
                    paginationMode="server"
                    sortingMode="server"
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    rowCount={totalElements}
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={(newModel) => {
                        setPage(newModel.page);
                        setPageSize(newModel.pageSize);
                    }}
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
                    onCellClick={(params: GridCellParams) => {
                        if (params.field === 'timetableName') {
                            handleOpenDetails(params.row as TimetableDTO);
                        }
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '0.85rem' : '0.95rem',
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: isMobile ? '0.8rem' : '0.9rem',
                        },
                        '--DataGrid-overlayHeight': '300px',
                        overflowX: 'auto',
                    }}
                />
            </Box>

            {/* Dialog Edit */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth={isMobile ? 'xs' : 'lg'}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        margin: { xs: 2, sm: 4 },
                        maxHeight: { xs: '90vh', sm: '80vh' },
                    },
                }}
            >
                <DialogTitle sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                    Edit Timetable
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {/* Basic Information */}
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Basic Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={useCourses}
                                            onChange={(e) => {
                                                setUseCourses(e.target.checked);
                                                setFormData((prev) => ({ ...prev, timetableName: null }));
                                                setSelectedCourses([]);
                                                setCreateNewCourse(false);
                                            }}
                                        />
                                    }
                                    label="Use Courses"
                                />
                            </Grid>
                            {!useCourses && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Timetable Name"
                                        name="timetableName"
                                        value={formData.timetableName || ''}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        size={isMobile ? 'small' : 'medium'}
                                    />
                                </Grid>
                            )}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    sx={{ minWidth: { xs: '100%', sm: 120 } }}
                                >
                                    <InputLabel>Semester</InputLabel>
                                    <Select
                                        value={formData.semesterId || ''}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, semesterId: Number(e.target.value) || 0 }))
                                        }
                                        label="Semester"
                                        sx={{ borderRadius: 10 }}
                                    >
                                        <MenuItem value="">
                                            <em>Select Semester</em>
                                        </MenuItem>
                                        {semesters.map((semester) => (
                                            <MenuItem key={semester.id} value={semester.id}>
                                                {semester.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InstructorAutocomplete
                                    selectedInstructorId={formData.instructorId}
                                    setSelectedInstructorId={(id) => {
                                        setFormData({ ...formData, instructorId: id, instructor: { ...formData.instructor, id } });
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    label="Day of Week"
                                    name="dayOfWeek"
                                    value={formData.dayOfWeek || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size={isMobile ? 'small' : 'medium'}
                                >
                                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                                        <MenuItem key={day} value={day}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <RoomAutocomplete
                                    selectedRoomId={formData.roomId}
                                    setSelectedRoomId={(id) =>
                                        setFormData((prev) => ({ ...prev, roomId: id || 0 }))
                                    }
                                />
                            </Grid>
                        </Grid>

                        {/* Course Information */}
                        {useCourses && (
                            <>
                                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                    Course Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
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
                                    </Grid>
                                    {useCourses && !createNewCourse && (
                                        <Grid size={{ xs: 12 }}>
                                            <CourseAutocomplete
                                                selectedCourses={selectedCourses}
                                                setSelectedCourses={(courses) => {
                                                    console.log('CourseAutocomplete received courseIds:', courses.map(c => c.id));
                                                    setSelectedCourses(courses);
                                                    setFormData((prev) => ({ ...prev, courses }));
                                                }}
                                            />
                                        </Grid>
                                    )}
                                    {useCourses && createNewCourse && (
                                        <>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Course Name"
                                                    name="name"
                                                    value={newCourse.name}
                                                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    size={isMobile ? 'small' : 'medium'}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Course Code"
                                                    name="code"
                                                    value={newCourse.code}
                                                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    size={isMobile ? 'small' : 'medium'}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="NH"
                                                    name="nh"
                                                    value={newCourse.nh}
                                                    onChange={(e) => setNewCourse({ ...newCourse, nh: e.target.value })}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    size={isMobile ? 'small' : 'medium'}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="TH"
                                                    name="th"
                                                    value={newCourse.th}
                                                    onChange={(e) => setNewCourse({ ...newCourse, th: e.target.value })}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    size={isMobile ? 'small' : 'medium'}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <InstructorAutocomplete
                                                    selectedInstructorId={newCourse.instructorId}
                                                    setSelectedInstructorId={(id) => setNewCourse((prev) => ({ ...prev, instructorId: id || 0 }))}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Credits"
                                                    name="credits"
                                                    type="number"
                                                    value={newCourse.credits || ''}
                                                    onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                                                    variant="outlined"
                                                    fullWidth
                                                    size={isMobile ? 'small' : 'medium'}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    label="Course Description"
                                                    name="description"
                                                    value={newCourse.description}
                                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    size={isMobile ? 'small' : 'medium'}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </>
                        )}

                        {/* Time Information */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                            Time Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <LessonTimeAutocomplete
                                    selectedLessonTimeId={formData.startLessonTimeId}
                                    setSelectedLessonTimeId={(id) =>
                                        setFormData((prev) => ({ ...prev, startLessonTimeId: id || 0 }))
                                    }
                                    label="Start Lesson"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <LessonTimeAutocomplete
                                    selectedLessonTimeId={formData.endLessonTimeId}
                                    setSelectedLessonTimeId={(id) =>
                                        setFormData((prev) => ({ ...prev, endLessonTimeId: id || 0 }))
                                    }
                                    label="End Lesson"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Study Time"
                                    name="studyTime"
                                    value={formData.studyTime || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    multiline
                                    rows={2}
                                    placeholder="e.g., 03/10/2024 - 24/10/2024"
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Cancel Dates"
                                    name="cancelDates"
                                    value={formData.cancelDates?.join(',') || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="e.g., 10/10/2024,15/10/2024"
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Start Lesson"
                                    name="startLesson"
                                    type="number"
                                    value={formData.startLesson || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                        </Grid>

                        {/* Additional Information */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                            Additional Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Class ID"
                                    name="classId"
                                    value={formData.classId || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Number of Students"
                                    name="numberOfStudents"
                                    type="number"
                                    value={formData.numberOfStudents || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Total Lessons per Semester"
                                    name="totalLessonSemester"
                                    type="number"
                                    value={formData.totalLessonSemester || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Total Lessons per Day"
                                    name="totalLessonDay"
                                    type="number"
                                    value={formData.totalLessonDay || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Delete Confirmation */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth={isMobile ? 'xs' : 'lg'}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        margin: { xs: 2, sm: 4 },
                        maxHeight: { xs: '90vh', sm: '80vh' },
                    },
                }}
            >
                <DialogTitle sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this timetable?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Details */}
            <Dialog
                open={openDetailsDialog}
                onClose={handleCloseDetails}
                maxWidth={isMobile ? 'xs' : 'md'}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        margin: { xs: 2, sm: 4 },
                        maxHeight: { xs: '90vh', sm: '80vh' },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: 'grey.50',
                        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                    }}
                >
                    Timetable Details
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
                    {selectedTimetable && (
                        <Box>
                            {/* Basic Information */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Basic Information
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Timetable Name:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.timetableName || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Semester:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.semester?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Day of Week:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.dayOfWeek || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Instructor:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.instructor?.user?.fullName || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Room:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.room?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Class ID:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.classId || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Time Information */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Time Information
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Start Lesson:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.startLessonTime
                                                ? `Lesson ${selectedTimetable.startLessonTime.lessonNumber} (${selectedTimetable.startLessonTime.startTime})`
                                                : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            End Lesson:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.endLessonTime
                                                ? `Lesson ${selectedTimetable.endLessonTime.lessonNumber} (${selectedTimetable.endLessonTime.endTime})`
                                                : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Study Time:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.studyTime || 'N/A'}
                                        </Typography>
                                    </Box>
                                    {selectedTimetable.cancelDates && selectedTimetable.cancelDates.length > 0 && (
                                        <Box mb={1}>
                                            <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                                Cancel Dates:
                                            </Typography>
                                            <Box sx={{ ml: 2 }}>
                                                {selectedTimetable.cancelDates.map((date, index) => (
                                                    <Typography key={index} variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                                        - {date}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>

                            {/* Course Information */}
                            {selectedTimetable.courses && selectedTimetable.courses.length > 0 && (
                                <>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Course Information
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mb: 3 }}>
                                        <Table size={isMobile ? 'small' : 'medium'}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'primary.main' }}>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        Name
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        Code
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        NH
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        TH
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                                        Credits
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedTimetable.courses.map((course, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                                                            '&:hover': { bgcolor: 'primary.light' },
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{course.name || 'N/A'}</TableCell>
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{course.code || 'N/A'}</TableCell>
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{course.nh || 'N/A'}</TableCell>
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{course.th || 'N/A'}</TableCell>
                                                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{course.credits || 'N/A'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}

                            {/* Additional Information */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Additional Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Number of Students:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.numberOfStudents || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Lessons per Day:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.totalLessonDay || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Lessons per Semester:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.totalLessonSemester || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" sx={{ minWidth: 150, fontWeight: 'bold', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                            Description:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                            {selectedTimetable.description || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseDetails}
                        variant="outlined"
                        sx={{ borderRadius: '20px', textTransform: 'none', px: 3 }}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TimetableManager;