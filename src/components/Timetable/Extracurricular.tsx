import {useParams} from "react-router";
import {useEffect} from "react";
import {RootState, useAppDispatch} from "../../state/store.ts";
import {fetchCourseDetails} from "../../state/Timetable/Reducer.ts";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

import {Card, CardContent, Typography} from '@mui/material';
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
    const {timetable} = useSelector((state: RootState) => state.timetable);
    const location = useLocation();
    const { convertDayOfWeek } = useConvertDayOfWeek();

    useEffect(() => {
        if (timetableName) {
            dispatch(fetchCourseDetails({timetableName}));
        }
    }, [timetableName, dispatch, location.pathname]);

    return (
        <div className="container mx-auto px-6 py-10">
            <Typography variant="h4" className="text-center font-bold mb-8 text-blue-700">{t('timetable.extracurricular.title')}</Typography>
            <Card className="max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden bg-blue-50">
                <CardContent className="p-6">
                    <div className="mb-4">
                        <Typography variant="body1" className="text-blue-700 flex items-center">
                            <SchoolIcon className="mr-2"/> <span className="font-bold text-black">{t('timetable.extracurricular.name')}</span>
                            <span className="ml-2 text-emerald-400">{timetableName}</span>
                        </Typography>
                    </div>


                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <CalendarTodayIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.daysOfWeek')}</span>
                            <span className="ml-2 text-emerald-400">
                                {convertDayOfWeek(timetable?.dayOfWeek || 'Undefined')}
                            </span>

                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <AccessTimeIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.startLesson')}</span>
                            <span className="ml-2 text-emerald-400">{timetable?.startLesson}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <FormatListNumberedIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.numberOfLesson')}</span>
                            <span className="ml-2 text-emerald-400">{timetable?.totalLessonDay}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <RoomIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.room')}</span>
                            <span className="ml-2 text-emerald-400">{timetable?.room.name}</span>
                        </Typography>
                    </div>


                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <PersonSearchIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.instructorId')}</span>
                            <span className="ml-2 text-emerald-400">{timetable?.instructor.instructorId}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <AccountBoxIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.instructor')}</span>
                            <span className="ml-2 text-emerald-400">{timetable?.instructor.user.fullName}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <DescriptionIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">{t('timetable.extracurricular.description')}</span>
                            <span className="ml-2 text-emerald-400">
                                {timetable?.description}
                            </span>
                        </Typography>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default Extracurricular;
