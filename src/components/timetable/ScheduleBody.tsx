import React from 'react';
import { TableBody } from '@mui/material';
import {Timetable} from "../../state/timetable/timetableSlice.ts";
import ScheduleRow from "./ScheduleRow.tsx";
import {RoomResponse} from "../../services/asset/roomApi.ts";

interface ScheduleBodyProps {
    rooms: RoomResponse[];
    periods: number[];
    daysOfWeek: string[];
    timetables: Timetable[];
    selectedWeek: { startDate: string; endDate: string } | null;
    getScheduleItems: (
        dayOfWeek: string,
        period: number,
        roomName: string
    ) => Timetable[]; // Replace with appropriate type
    getLessonTime: (period: number) => any;
    handleCourseClick: (
        courseId: string | null,
        NH: string | null,
        TH: string | null,
        studyTime: string | null,
        timetableName: string | null
    ) => void;
}

const ScheduleBody: React.FC<ScheduleBodyProps> = ({
                                                       rooms,
                                                       periods,
                                                       daysOfWeek,
                                                       timetables,
                                                       selectedWeek,
                                                       getScheduleItems,
                                                       getLessonTime,
                                                       handleCourseClick,
                                                   }) => {
    return (
        <TableBody>
            {rooms.map((room) =>
                periods.map((period) => (
                    <ScheduleRow
                        key={`${room}-${period}`}
                        room={room}
                        period={period}
                        daysOfWeek={daysOfWeek}
                        getScheduleItems={getScheduleItems}
                        timetables={timetables}
                        selectedWeek={selectedWeek}
                        getLessonTime={getLessonTime}
                        handleCourseClick={handleCourseClick}
                        periods={periods}
                    />
                ))
            )}
        </TableBody>
    );
};

export default ScheduleBody;
