import {useParams} from "react-router";
import React, {useEffect, useRef} from "react";
import {RootState, useAppDispatch} from "../../state/store.ts";
import {fetchCourseDetails} from "../../state/timetable/thunk.ts";
import {useSelector} from "react-redux";

import {Box, Card, CardContent, Typography} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildIcon from '@mui/icons-material/Build';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import useConvertDayOfWeek from "../../utils/convertDay.ts";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";

const CardDetailsCourse = () => {
    const {t}=useTranslation();
    const {courseId, NH, TH,studyTime} = useParams<{ courseId: string, NH: string, TH: string,studyTime: string,timetableName: string;}>();
    const decodeStudyTime = studyTime ? decodeURIComponent(studyTime) : "";
    const dispatch = useAppDispatch();
    const {course} = useSelector((state: RootState) => state.timetable);
    const previousParams = useRef<string | null>(null);
    const { convertDayOfWeek} = useConvertDayOfWeek();
    useEffect(() => {
        if (
            courseId &&
            NH &&
            TH &&
            decodeStudyTime &&
            (previousParams.current !== `${courseId}-${NH}-${TH}`)
        ) {
            dispatch(fetchCourseDetails({ courseId, NH, TH,decodeStudyTime }));
            console.log("Gọi API lần đầu tiên",course);
            previousParams.current = `${courseId}-${NH}-${TH}`;
        }
    }, [courseId, NH, TH,decodeStudyTime, dispatch]);



    return (
        <div className="container mx-auto px-6 py-10">
            <Helmet>
                <title>Details Timetable | Lab Management IT</title>
            </Helmet>
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    mb: 5,
                    color: 'primary.main'
                }}
            >
                {t('timetable.cardDetailsCourse.title')}
            </Typography>
            <Card className="max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden " sx={{bgColor:'background.paper'}} >
                <CardContent className="p-6">
                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                            <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.courseId')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {courseId}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ClassIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.courseName')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.courses[0].name}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormatListNumberedIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.totalLessons')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.totalLessonSemester}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCardIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.credits')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.courses[0].credits}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <MenuBookIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                NH:
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {NH}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <BuildIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                TH:
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {TH}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.students')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.numberOfStudents}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.daysOfWeek')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {convertDayOfWeek(course?.dayOfWeek || "Undefined")}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.startLesson')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.startLesson}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormatListNumberedIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.numberOfLesson')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.totalLessonDay}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <RoomIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.room')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.room.name}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <HourglassBottomIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.studyTime')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.studyTime?.split('\n').map((timeRange, index) => (
                                    <span key={index}>
                                        {timeRange}
                                        <br />
                                    </span>
                                ))}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonSearchIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.instructorId')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.instructor.instructorId}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ mb:3 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountBoxIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('timetable.cardDetailsCourse.instructor')}
                            </Typography>
                            <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                                {course?.instructor.user.fullName}
                            </Typography>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default CardDetailsCourse;
