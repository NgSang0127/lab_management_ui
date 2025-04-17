import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import {useTranslation} from "react-i18next";


const ScheduleHeader: React.FC = () => {
    const {t}=useTranslation();
    const translatedDaysOfWeek = t("timetable.daysOfWeek", { returnObjects: true }) as string [];
    return (
        <TableHead>
            <TableRow>
                <TableCell
                    sx={{
                        border: '1px solid rgb(175, 175, 175)',
                        backgroundColor: 'primary.main',
                        color: 'info.light',
                        padding: '0',
                        verticalAlign: 'middle',
                        height: '2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: { xs: '50px', sm: '80px' }
                    }}
                >
                    {t('timetable.scheduleTableHeader.room')}
                </TableCell>
                {translatedDaysOfWeek.map((day) => (
                    <TableCell
                        key={day}
                        sx={{
                            border: '1px solid rgb(175, 175, 175)',
                            backgroundColor: 'primary.main',
                            color: 'info.light',
                            padding: '0',
                            verticalAlign: 'middle',
                            height: '2px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                    >
                        {day}
                    </TableCell>
                ))}
                <TableCell
                    sx={{
                        border: '1px solid rgb(175, 175, 175)',
                        backgroundColor: 'primary.main',
                        color: 'info.light',
                        padding: '0',
                        verticalAlign: 'middle',
                        height: '2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: { xs: '50px', sm: '80px' }
                    }}

                >
                    {t('timetable.scheduleTableHeader.period')}
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

export default ScheduleHeader;
