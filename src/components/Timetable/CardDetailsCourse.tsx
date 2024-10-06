import {useParams} from "react-router";
import {useEffect} from "react";
import {RootState, useAppDispatch} from "../../state/store.ts";
import {fetchCourseDetails} from "../../state/Timetable/Reducer.ts";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import convertDayOfWeekToVietnamese from "../../utils/convertDay.ts";
import {Card, CardContent, Typography} from '@mui/material';
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

const CardDetailsCourse = () => {
    const {courseId, NH, TH} = useParams<{ courseId: string, NH: string, TH: string }>();
    const dispatch = useAppDispatch();
    const {timetable} = useSelector((state: RootState) => state.timetable);
    const location = useLocation();

    useEffect(() => {
        if (courseId && NH && TH) {
            dispatch(fetchCourseDetails({courseId, NH, TH}));
        }
    }, [courseId, NH, TH, dispatch, location.pathname]);

    return (
        <div className="container mx-auto px-6 py-10">
            <Typography variant="h4" className="text-center font-bold mb-8 text-blue-700">Chi tiết môn học</Typography>
            <Card className="max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden bg-blue-50">
                <CardContent className="p-6">
                    <div className="mb-4">
                        <Typography variant="body1" className="text-blue-700 flex items-center">
                            <SchoolIcon className="mr-2"/> <span className="font-bold text-black">Mã môn học:</span>
                            <span className="ml-2 text-emerald-400">{courseId}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <ClassIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Tên môn học:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.courses[0].name}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <FormatListNumberedIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Tổng số tiết:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.totalLessonSemester}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <CreditCardIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Số tín chỉ:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.courses[0].credits}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <MenuBookIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">NH:</span>
                            <span className="ml-2 text-emerald-400">{NH}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <BuildIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">TH:</span>
                            <span className="ml-2 text-emerald-400">{TH}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <PeopleIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Số sinh viên:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.numberOfStudents}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <CalendarTodayIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Thứ:</span>
                            <span
                                className="ml-2 text-emerald-400">{convertDayOfWeekToVietnamese(timetable?.dayOfWeek ||"Undefined")}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <AccessTimeIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Tiết bắt đầu:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.startLesson}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <FormatListNumberedIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Số tiết:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.totalLessonDay}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <RoomIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Phòng học:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.room.name}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <HourglassBottomIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Thời gian học:</span>
                            <span className="ml-2 text-emerald-400">
                                {timetable?.studyTime?.split('\n').map((timeRange, index) => (
                                    <span key={index}>{timeRange}
                                    <br/>
                                    </span>
                                ))}
                            </span>
                        </Typography>
                    </div>


                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <PersonSearchIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Mã viên chức:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.instructor.instructorId}</span>
                        </Typography>
                    </div>

                    <div className="mb-4">
                        <Typography variant="body1" className="flex items-center">
                            <AccountBoxIcon className="mr-2 text-blue-600"/>
                            <span className="font-bold text-black">Giang viên:</span>
                            <span className="ml-2 text-emerald-400">{timetable?.instructor.user.fullName}</span>
                        </Typography>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default CardDetailsCourse;
