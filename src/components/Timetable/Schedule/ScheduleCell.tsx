import React from 'react';
import { TableCell, Box } from '@mui/material';
import {Timetable} from "../../../state/Timetable/Action.ts";
import CustomTooltip from "./CustomTooltip.tsx";

interface ScheduleCellProps {
    dayOfWeek: string;
    period: number;
    roomName: string;
    scheduleItems: Timetable[];
    selectedWeek: { startDate: string; endDate: string } | null;
    getCourseColor: (courseName: string | undefined, timetableName: string) => string;
    handleCourseClick: (
        courseId: string | null,
        NH: string | null,
        TH: string | null,
        studyTime: string | null,
        timetableName: string | null
    ) => void;
}

const ScheduleCell: React.FC<ScheduleCellProps> = ({
                                                       period,
                                                       scheduleItems,
                                                       getCourseColor,
                                                       handleCourseClick,
                                                   }) => {
    if (scheduleItems.length > 0) {
        const firstItem = scheduleItems[0];
        const rowSpan =
            firstItem.endLessonTime.lessonNumber - firstItem.startLessonTime.lessonNumber + 1;

        if (firstItem.startLessonTime.lessonNumber === period) {
            const courseColor = getCourseColor(firstItem.courses?.[0]?.name, firstItem.timetableName);
            return (
                <TableCell
                    rowSpan={rowSpan}
                    align="center"
                    size="small"
                    padding="none"
                    sx={{
                        border: '1px solid rgb(175, 175, 175)',
                        position: 'relative',
                        cursor: 'pointer',
                        padding: {
                            xs: '2px',
                            sm: '3px',
                            md: '0px',
                        }, // Giảm padding

                        fontSize: {
                            xs: '0.6rem',
                            sm: '0.7rem',
                            md: '0.8rem',
                        }, // Giảm kích thước chữ
                        height: {
                            xs: '25px',
                            sm: '30px',
                            md: '35px',
                        },
                        overflow: 'hidden', // Ẩn nội dung tràn

                    }}
                >
                    <Box
                        className={`flex flex-col justify-center items-center h-full text-xs ${courseColor}`}
                        sx={{
                            width: '100%',
                            height: '100%',

                        }}
                    >
                        {scheduleItems.map((scheduleItem, index) => (
                            <CustomTooltip key={index} scheduleItem={scheduleItem}>
                                <Box
                                    onClick={() =>
                                        handleCourseClick(
                                            scheduleItem.courses && scheduleItem.courses.length > 0
                                                ? scheduleItem.courses[0].code
                                                : null,
                                            scheduleItem.courses && scheduleItem.courses.length > 0
                                                ? scheduleItem.courses[0].nh
                                                : null,
                                            scheduleItem.courses && scheduleItem.courses.length > 0
                                                ? scheduleItem.courses[0].th
                                                : null,
                                            scheduleItem.studyTime && scheduleItem.studyTime.length > 0
                                                ? encodeURIComponent(scheduleItem.studyTime)
                                                : null,
                                            scheduleItem.timetableName // Pass timetableName if no course
                                        )
                                    }
                                    className="w-full h-full flex flex-col justify-center items-center text-center p-1 cursor-pointer"
                                >
                                    <span className="font-semibold p-1 text-xs text-green-700">
                                        {scheduleItem.courses && scheduleItem.courses.length > 0
                                            ? scheduleItem.courses[0].name
                                            : scheduleItem.timetableName}
                                    </span>
                                    <span className=" pt-2 text-xs italic text-green-600">
                                        {scheduleItem.instructor.user.fullName}
                                    </span>
                                </Box>
                            </CustomTooltip>
                        ))}
                    </Box>
                </TableCell>
            );
        } else {
            return null;
        }
    } else {
        return (
            <TableCell
                align="center"
                size="small"
                padding="none"
                sx={{
                    border: '1px solid rgb(175, 175, 175)',
                    height: {
                        xs: '25px',
                        sm: '30px',
                        md: '27px',
                    }, // Giảm chiều cao ô
                    padding: {
                        xs: '0px',
                        sm: '0px',
                        md: 0,
                    }, // Giảm padding
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: {
                        xs: '0.6rem',
                        sm: '0.7rem',
                        md: '0.75rem',
                    }, // Giảm kích thước chữ
                }}
            >
                {/* Empty Cell */}
            </TableCell>
        );
    }
};

export default ScheduleCell;
