import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import {daysOfWeek} from "../../../utils/utilsTimetable.ts";


const ScheduleHeader: React.FC = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell
                    sx={{
                        border: '1px solid rgb(175, 175, 175)',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0',
                        verticalAlign: 'middle',
                        height: '2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: { xs: '50px', sm: '80px' }
                    }}
                >
                    Room
                </TableCell>
                {daysOfWeek.map((day) => (
                    <TableCell
                        key={day}
                        sx={{
                            border: '1px solid rgb(175, 175, 175)',
                            backgroundColor: '#3b82f6',
                            color: 'white',
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
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0',
                        verticalAlign: 'middle',
                        height: '2px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: { xs: '50px', sm: '80px' }
                    }}

                >
                    Period
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

export default ScheduleHeader;
