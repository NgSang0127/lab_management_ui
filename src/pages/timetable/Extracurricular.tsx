import {useParams} from "react-router";
import {useEffect} from "react";
import {RootState, useAppDispatch} from "../../state/store.ts";
import {fetchCourseDetails} from "../../state/timetable/thunk.ts";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

import {Box, Card, CardContent, Typography} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import DescriptionIcon from '@mui/icons-material/Description';
import useConvertDayOfWeek from "../../utils/convertDay.ts";
import {useTranslation} from "react-i18next";

const Extracurricular = () => {
    const {t}=useTranslation();
    const {timetableName} = useParams<{ timetableName: string }>();
    const dispatch = useAppDispatch();
    const {course} = useSelector((state: RootState) => state.timetable);
    const location = useLocation();
    const { convertDayOfWeek } = useConvertDayOfWeek();

    useEffect(() => {
        if (timetableName) {
            dispatch(fetchCourseDetails({timetableName}));
        }
    }, [timetableName, dispatch, location.pathname]);

    return (
        <div className="container mx-auto px-6 py-10">
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    mb: 8,
                    color: 'primary.main',
                }}
            >
                {t('timetable.extracurricular.title')}
            </Typography>
            <Card className="max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden " sx={{bgColor:'background.paper'}}>
                <CardContent className="p-6">
                    <Box sx={{ mb:3 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <SchoolIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.name')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {timetableName}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.daysOfWeek')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {convertDayOfWeek(course?.dayOfWeek || 'Undefined')}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.startLesson')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {course?.startLesson}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormatListNumberedIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.numberOfLesson')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {course?.totalLessonDay}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <RoomIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.room')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {course?.room.name}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonSearchIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.instructorId')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {course?.instructor.instructorId}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountBoxIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.instructor')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {course?.instructor.user.fullName}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <DescriptionIcon sx={{ mr: 1, color: 'primary.dark' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.extracurricular.description')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 1, color: 'success.main' }}>
                                {course?.description}
                            </Typography>
                        </Typography>
                    </Box>

                </CardContent>
            </Card>
        </div>
    );
};

export default Extracurricular;
