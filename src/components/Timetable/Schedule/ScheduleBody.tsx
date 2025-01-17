import React from 'react';
import { TableBody } from '@mui/material';
import {Timetable} from "../../../state/Timetable/Action.ts";
import ScheduleRow from "./ScheduleRow.tsx";

interface ScheduleBodyProps {
    rooms: string[];
    periods: number[];
    daysOfWeek: string[];
    timetables: Timetable[]; // Replace with appropriate type
    selectedWeek: { startDate: string; endDate: string } | null;
    getScheduleItems: (
        dayOfWeek: string,
        period: number,
        roomName: string
    ) => Timetable[]; // Replace with appropriate type
    getLessonTime: (period: number) => any; // Replace with appropriate type
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
