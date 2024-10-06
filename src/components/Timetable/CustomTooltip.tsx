import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {Timetable} from '../../state/Timetable/Action.ts';
import convertDayOfWeekToVietnamese from '../../utils/convertDay.ts';

// Custom Tooltip component
const CustomTooltip = ({scheduleItem, children}: { scheduleItem: Timetable, children: React.ReactNode }) => {
    const hasCourse = scheduleItem.courses && scheduleItem.courses.length > 0;
    return (
        <Tooltip
            title={
                <div className="text-xs">
                    <div className="tooltip-header bg-blue-400 text-white p-2 rounded-t  flex items-center">
                        <AssignmentIndIcon/>
                        <span className="pl-2">{hasCourse ? scheduleItem.courses[0].name : scheduleItem.timetableName}</span>
                    </div>
                    <div className="tooltip-body bg-white p-2 text-left text-black w-full h-full">
                        {
                            hasCourse ? (
                                    <>
                                        <p><strong>Mã Môn Học :</strong> <span
                                            className="text-teal-600">{`${scheduleItem.courses[0].code} nhóm ${scheduleItem.courses[0].nh}`}</span>
                                        </p>
                                        <p><strong>Tên Môn Học :</strong> <span
                                            className="text-teal-600">{scheduleItem.courses[0].name}</span></p>
                                        <p><strong>Phòng Học :</strong> <span
                                            className="text-teal-600">{scheduleItem.room.name}</span></p>
                                        <p><strong>Thứ :</strong> <span
                                            className="text-teal-600">{convertDayOfWeekToVietnamese(scheduleItem.dayOfWeek)}</span>
                                        </p>
                                        <p><strong>Tiết Bắt Đầu :</strong> <span
                                            className="text-teal-600">{scheduleItem.startLessonTime.lessonNumber}</span></p>
                                        <p><strong>Số Tiết :</strong> <span
                                            className="text-teal-600">{scheduleItem.endLessonTime.lessonNumber - scheduleItem.startLessonTime.lessonNumber + 1}</span>
                                        </p>
                                        <p><strong>Giảng Viên :</strong> <span
                                            className="text-teal-600">{scheduleItem.instructor.user.fullName}</span></p>
                                        <p><strong>Lớp :</strong> <span
                                            className="text-teal-600">{scheduleItem.classId}</span></p>

                                    </>
                                ) :
                                (

                                    <>
                                        <p><strong>Tên môn học:</strong> <span
                                            className="text-teal-600">{scheduleItem.timetableName}</span></p>
                                        <p><strong>Phòng Học:</strong> <span
                                            className="text-teal-600">{scheduleItem.room.name}</span></p>
                                        <p><strong>Thứ:</strong> <span
                                            className="text-teal-600">{convertDayOfWeekToVietnamese(scheduleItem.dayOfWeek)}</span>
                                        </p>
                                        <p><strong>Tiết Bắt Đầu:</strong> <span
                                            className="text-teal-600">{scheduleItem.startLessonTime.lessonNumber}</span>
                                        </p>
                                        <p><strong>Số Tiết:</strong> <span
                                            className="text-teal-600">{scheduleItem.endLessonTime.lessonNumber - scheduleItem.startLessonTime.lessonNumber + 1}</span>
                                        </p>
                                        <p><strong>Giảng Viên:</strong> <span
                                            className="text-teal-600">{scheduleItem.instructor.user.fullName}</span></p>
                                    </>
                                )
                        }
                    </div>
                </div>
            }
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 12], // Slightly offset from the mouse pointer
                        },
                    },
                ],
            }}
            followCursor

        >
            <div className="tooltip-target w-full h-full">
                {children}
            </div>
        </Tooltip>
    );
};

export default CustomTooltip;
