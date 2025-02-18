import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import {useTranslation} from "react-i18next";

interface ScheduleHeaderProps {
    daysOfWeek: string[];
    rooms: string[];
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ daysOfWeek }) => {
    const {t}=useTranslation();
    return (
        <TableHead>
            <TableRow>
                <TableCell
                    align="center"
                    sx={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: '1px solid rgb(175, 175, 175)',
                        width: {
                            xs: '60px', // Thiết bị nhỏ
                            sm: '80px', // Thiết bị trung bình
                            md: '100px', // Thiết bị lớn
                        },
                        fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.85rem',
                        },
                        padding: {
                            xs: '4px',
                            sm: '6px',
                            md: '8px',
                        },
                    }}
                >
                    {t('timetable.scheduleHeader.room')}
                </TableCell>
                {daysOfWeek.map((day) => (
                    <TableCell
                        key={day}
                        align="center"
                        sx={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: '1px solid rgb(175, 175, 175)',
                            fontSize: {
                                xs: '0.65rem',
                                sm: '0.75rem',
                                md: '0.85rem',
                            },
                            padding: {
                                xs: '4px',
                                sm: '6px',
                                md: '8px',
                            },
                        }}
                    >
                        {day}
                    </TableCell>
                ))}
                <TableCell
                    align="center"
                    sx={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: '1px solid rgb(175, 175, 175)',
                        width: {
                            xs: '60px',
                            sm: '80px',
                            md: '100px',
                        },
                        fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.85rem',
                        },
                        padding: {
                            xs: '4px',
                            sm: '6px',
                            md: '8px',
                        },
                    }}
                >
                    {t('timetable.scheduleHeader.period')}
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

export default ScheduleHeader;
