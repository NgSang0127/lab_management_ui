import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Collapse,
    Card,
    CardContent,
    Badge,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {RootState, useAppDispatch} from '../../state/store.ts';
import { getTimetables } from '../../state/timetable/thunk.ts';
import { approveTimetable, rejectTimetable } from '../../state/timetable/thunk.ts';
import { useTranslation } from 'react-i18next';
import { Timetable } from '../../state/timetable/timetableSlice.ts';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import LoadingIndicator from '../../components/support/LoadingIndicator.tsx';
import {useSelector} from "react-redux";
import { ExpandLess, ExpandMore, Schedule, CheckCircle, Cancel } from '@mui/icons-material';

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#ff9800',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        minWidth: '20px',
        height: '20px',
        borderRadius: '10px',
        border: `2px solid ${theme.palette.background.paper}`,
        animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.1)',
        },
        '100%': {
            transform: 'scale(1)',
        },
    },
}));

const PendingHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#FFF3CD',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.warning.main}`,
}));

const StatusChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    '&.pending': {
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
        animation: 'pulse 2s infinite',
    },
    '&.approved': {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
    '&.rejected': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },
    '@keyframes pulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
        '100%': { transform: 'scale(1)' },
    },
}));

const PendingTimetablePanel: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [pendingTimetables, setPendingTimetables] = useState<Timetable[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    // Đếm số lượng pending timetables
    const pendingCount = pendingTimetables.length;

    useEffect(() => {
        const loadPendingTimetables = async () => {
            if (isOpen && (user.role === 'ADMIN' || user.role === 'OWNER' || user.role === 'CO_OWNER')) {
                setIsLoading(true);
                try {
                    const params = {
                        page: 0,
                        size: 10,
                        keyword: '',
                        roomName: '',
                        semesterIds: '',
                        sortBy: '',
                        sortOrder: 'asc',
                        status: 'PENDING',
                    };
                    const action = await dispatch(getTimetables(params));
                    if (getTimetables.fulfilled.match(action)) {
                        setPendingTimetables(action.payload.content || []);
                    }
                } catch (err: any) {
                    handleAlert(t('timetable.pending.errors.fetch', {
                        error: err.message || err,
                        defaultValue: 'Failed to load pending timetables: {{error}}'
                    }), 'error');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setPendingTimetables([]);
            }
        };
        loadPendingTimetables();
    }, [isOpen, user.role, dispatch, t]);

    // Load pending count ngay khi component mount
    useEffect(() => {
        const loadPendingCount = async () => {
            if (user.role === 'ADMIN' || user.role === 'OWNER' || user.role === 'CO_OWNER') {
                try {
                    const params = {
                        page: 0,
                        size: 1,
                        keyword: '',
                        roomName: '',
                        semesterIds: '',
                        sortBy: '',
                        sortOrder: 'asc',
                        status: 'PENDING',
                    };
                    const action = await dispatch(getTimetables(params));
                    if (getTimetables.fulfilled.match(action)) {
                        // Chỉ set số lượng để hiển thị badge
                        if (!isOpen) {
                            setPendingTimetables(new Array(action.payload.totalElements).fill({}));
                        }
                    }
                } catch (err) {
                    console.error('Failed to load pending count:', err);
                }
            }
        };
        loadPendingCount();
    }, [user.role, dispatch, isOpen]);

    const handleAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => setAlertOpen(false);

    const getTimetableDisplayName = (timetable: Timetable): string => {
        if (timetable.timetableName && timetable.timetableName.trim()) return timetable.timetableName;
        if (timetable.courses && timetable.courses.length > 0) {
            const courseName = timetable.courses[0].name;
            if (courseName && courseName.trim()) return courseName;
        }
        return t('timetable.pending.defaultName', { defaultValue: 'Unnamed Timetable' });
    };

    const handleApprove = async (id: number) => {
        try {
            await dispatch(approveTimetable(id)).unwrap();
            handleAlert(t('timetable.pending.success.approve', { defaultValue: 'Timetable approved successfully' }), 'success');
            // Refresh list
            const params = {
                page: 0,
                size: 10,
                keyword: '',
                roomName: '',
                semesterIds: '',
                sortBy: '',
                sortOrder: 'asc',
                status: 'PENDING',
            };
            const action = await dispatch(getTimetables(params));
            if (getTimetables.fulfilled.match(action)) {
                setPendingTimetables(action.payload.content || []);
            }
        } catch (err: any) {
            handleAlert(t('timetable.pending.errors.approve', { error: err.message || err, defaultValue: 'Failed to approve timetable: {{error}}' }), 'error');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await dispatch(rejectTimetable(id)).unwrap();
            handleAlert(t('timetable.pending.success.reject', { defaultValue: 'Timetable rejected successfully' }), 'success');
            // Refresh list
            const params = {
                page: 0,
                size: 10,
                keyword: '',
                roomName: '',
                semesterIds: '',
                sortBy: '',
                sortOrder: 'asc',
                status: 'PENDING',
            };
            const action = await dispatch(getTimetables(params));
            if (getTimetables.fulfilled.match(action)) {
                setPendingTimetables(action.payload.content || []);
            }
        } catch (err: any) {
            handleAlert(t('timetable.pending.errors.reject', { error: err.message || err, defaultValue: 'Failed to reject timetable: {{error}}' }), 'error');
        }
    };

    if (!(user.role === 'ADMIN' || user.role === 'OWNER' || user.role === 'CO_OWNER')) return null;

    return (
        <Card sx={{ mb: 4, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
                {/* Header với badge */}
                <PendingHeader>
                    <Schedule sx={{ color: 'warning.main', fontSize: 24 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                            {t('timetable.pending.title', { defaultValue: 'Pending Timetables' })}
                        </Typography>
                        <StyledBadge
                            badgeContent={pendingCount}
                            sx={{
                                '& .MuiBadge-badge': {
                                    animation: pendingCount > 0 ? 'pulse 2s infinite' : 'none',
                                    backgroundColor: pendingCount > 0 ? '#ff9800' : '#e0e0e0',
                                },
                            }}
                        >
                            <Box sx={{ width: 20, height: 20 }} />
                        </StyledBadge>
                    </Box>

                    {/* Status chips */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <StatusChip
                            label={`${pendingCount} Pending`}
                            className="pending"
                            size="small"
                            icon={<Schedule />}
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsOpen(!isOpen)}
                            endIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            {isOpen
                                ? t('timetable.pending.hide', { defaultValue: 'Hide' })
                                : t('timetable.pending.show', { defaultValue: 'Show Pending' })}
                        </Button>
                    </Box>
                </PendingHeader>

                <Collapse in={isOpen}>
                    <Box>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <Typography>Loading...</Typography>
                            </Box>
                        ) : pendingTimetables.length > 0 ? (
                            <>
                                {/* Summary stats */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
                                    <StatusChip
                                        label={`${pendingCount} Awaiting Review`}
                                        className="pending"
                                        icon={<Schedule />}
                                    />
                                    <Chip
                                        label="Requires Action"
                                        color="warning"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>

                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        maxHeight: 500,
                                        overflow: 'auto',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                                    {t('timetable.pending.name', { defaultValue: 'Name' })}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                                    {t('timetable.pending.instructor', { defaultValue: 'Instructor' })}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                                    {t('timetable.pending.date', { defaultValue: 'Date' })}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                                    {t('timetable.pending.room', { defaultValue: 'Room' })}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                                    {t('timetable.pending.time', { defaultValue: 'Time' })}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                                    Status
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50', textAlign: 'center' }}>
                                                    {t('timetable.pending.actions', { defaultValue: 'Actions' })}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pendingTimetables.map((timetable, index) => (
                                                <TableRow
                                                    key={timetable.id}
                                                    sx={{
                                                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                                        '&:hover': { backgroundColor: 'action.selected' }
                                                    }}
                                                >
                                                    <TableCell sx={{ fontWeight: 500 }}>
                                                        {getTimetableDisplayName(timetable)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {timetable.instructor?.user?.fullName || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {timetable.studyTime}
                                                    </TableCell>
                                                    <TableCell>
                                                        {timetable.room?.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${timetable.startLesson} - ${timetable.endLessonTime?.lessonNumber}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip
                                                            label="Pending"
                                                            className="pending"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                                onClick={() => handleApprove(timetable.id)}
                                                                startIcon={<CheckCircle />}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    px: 2,
                                                                    textTransform: 'none',
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                {t('timetable.pending.approve', { defaultValue: 'Approve' })}
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleReject(timetable.id)}
                                                                startIcon={<Cancel />}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    px: 2,
                                                                    textTransform: 'none',
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                {t('timetable.pending.reject', { defaultValue: 'Reject' })}
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    backgroundColor: 'grey.50',
                                    borderRadius: 2,
                                    border: '1px dashed',
                                    borderColor: 'grey.300'
                                }}
                            >
                                <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                                <Typography color="text.secondary" variant="h6">
                                    {t('timetable.pending.noPending', { defaultValue: 'No pending timetables' })}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    All timetables have been reviewed!
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Collapse>

                <LoadingIndicator open={isLoading} />
                <CustomAlert
                    open={alertOpen}
                    onClose={handleCloseAlert}
                    message={alertMessage}
                    severity={alertSeverity}
                />
            </CardContent>
        </Card>
    );
};

export default PendingTimetablePanel;