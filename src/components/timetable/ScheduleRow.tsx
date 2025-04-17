import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import {Timetable} from "../../state/timetable/timetableSlice.ts";
import ScheduleCell from "./ScheduleCell.tsx";
import {getCourseColor} from "../../utils/courseColors.ts";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import {RoomResponse} from "../../services/asset/roomApi.ts";


interface ScheduleRowProps {
    room: RoomResponse;
    period: number;
    daysOfWeek: string[];
    getScheduleItems: (
        dayOfWeek: string,
        period: number,
        roomName: string
    ) => Timetable[];
    timetables: Timetable[];
    selectedWeek: { startDate: string; endDate: string } | null;
    getLessonTime: (period: number) => any;
    handleCourseClick: (
        courseId: string | null,
        NH: string | null,
        TH: string | null,
        studyTime: string | null,
        timetableName: string | null
    ) => void;
    periods: number[];
}

const ScheduleRow: React.FC<ScheduleRowProps> = ({
                                                     room,
                                                     period,
                                                     daysOfWeek,
                                                     getScheduleItems,
                                                     selectedWeek,
                                                     getLessonTime,
                                                     handleCourseClick,
                                                     periods,
                                                 }) => {
    const {t}=useTranslation();
    const isFirstPeriod = period === periods[0];
    const isLastPeriod = period === periods[periods.length - 1];
    return (
        <TableRow
            sx={{
                borderBottom: isLastPeriod ? '3px solid #000' : '1px solid rgb(175, 175, 175)',
                height: {
                    xs: '25px', // Thiết bị nhỏ
                    sm: '30px', // Thiết bị trung bình
                    md: '35px', // Thiết bị lớn
                },
            }}
        >
            {isFirstPeriod && (
                <TableCell
                    rowSpan={periods.length}
                    align="center"
                    size="small" // Sử dụng size="small"
                    padding="none" // Sử dụng padding="none"
                    sx={{
                        border: '1px solid rgb(175, 175, 175)',
                        backgroundColor: '#f3f4f6',
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                        width: { xs: '60px', sm: '80px', md: '100px' }, // Giảm chiều rộng nếu cần
                        padding: {
                            xs: 0,
                            sm: '3px',
                            md: '4px',
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
                        }, // Giảm chiều cao ô
                    }}
                >
                    {room.name}
                </TableCell>
            )}
            {daysOfWeek.map((dayOfWeek) => {
                const scheduleItems = getScheduleItems(dayOfWeek, period, room.name);
                return (
                    <ScheduleCell
                        key={`${dayOfWeek}-${room}-${period}`}
                        dayOfWeek={dayOfWeek}
                        period={period}
                        roomName={room.name}
                        scheduleItems={scheduleItems}
                        selectedWeek={selectedWeek}
                        getCourseColor={getCourseColor}
                        handleCourseClick={handleCourseClick}
                    />
                );
            })}
            <TableCell
                align="center"
                size="small"
                padding="none"
                sx={{
                    border: '1px solid rgb(175, 175, 175)',
                    backgroundColor: '#f3f4f6',
                    fontWeight: 'bold',
                    verticalAlign: 'middle',
                    width: { xs: '60px', sm: '80px', md: '100px' }, // Giảm chiều rộng nếu cần
                    padding: {
                        xs: '2px',
                        sm: '3px',
                        md: '4px',
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
                    }, // Giảm chiều cao ô
                }}
            >
                <Tooltip
                    title={t('timetable.scheduleRow.tooltip_title',{startTime:getLessonTime(period)?.startTime,endTime:getLessonTime(period)?.endTime})}
                    arrow
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [50, 10], // Dịch tooltip sang trái 10px
                                },
                            },
                        ],
                    }}
                >
                    <span className="cursor-pointer">{t('timetable.scheduleRow.content_tooltip')} {period}</span>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default ScheduleRow;
