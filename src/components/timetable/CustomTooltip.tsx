import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Timetable } from '../../state/timetable/timetableSlice.ts';
import { useTranslation } from "react-i18next";
import useConvertDayOfWeek from "../../utils/convertDay.ts";


const TooltipHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1.5),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1], // Bóng nhẹ từ theme
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[2],
    },
}));

const TooltipBody = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
}));

const InfoLabel = styled('strong')(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,
    fontWeight:600,
    marginRight: theme.spacing(1),
}));

const InfoValue = styled('span')(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.primary.dark,
}));

const CustomTooltip = ({ scheduleItem, children }: { scheduleItem: Timetable; children: React.ReactNode }) => {
    const { t } = useTranslation();
    const { convertDayOfWeek } = useConvertDayOfWeek();
    const hasCourse = scheduleItem.courses && scheduleItem.courses.length > 0;

    return (
        <Tooltip
            title={
                <div>
                    <TooltipHeader>
                        <AssignmentIndIcon sx={{ fontSize: '1.25rem' }} />
                        <span style={{ paddingLeft: '8px' }}>
              {hasCourse ? scheduleItem.courses[0].name : scheduleItem.timetableName}
            </span>
                    </TooltipHeader>
                    <TooltipBody>
                        {hasCourse ? (
                            <>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.code')}</InfoLabel>
                                    <InfoValue>
                                        {`${scheduleItem.courses[0].code} ${t('timetable.toolTip.group')} ${scheduleItem.courses[0].nh}`}
                                    </InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.name')}</InfoLabel>
                                    <InfoValue>{scheduleItem.courses[0].name}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.room')}</InfoLabel>
                                    <InfoValue>{scheduleItem.room.name}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.dayOfWeek')}</InfoLabel>
                                    <InfoValue>{convertDayOfWeek(scheduleItem.dayOfWeek)}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.startLesson')}</InfoLabel>
                                    <InfoValue>{scheduleItem.startLessonTime.lessonNumber}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.numberOfLesson')}</InfoLabel>
                                    <InfoValue>
                                        {scheduleItem.endLessonTime.lessonNumber - scheduleItem.startLessonTime.lessonNumber + 1}
                                    </InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.instructor')}</InfoLabel>
                                    <InfoValue>{scheduleItem.instructor.user.fullName}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.class')}</InfoLabel>
                                    <InfoValue>{scheduleItem.classId}</InfoValue>
                                </p>
                            </>
                        ) : (
                            <>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.name')}</InfoLabel>
                                    <InfoValue>{scheduleItem.timetableName}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.room')}</InfoLabel>
                                    <InfoValue>{scheduleItem.room.name}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.daysOfWeek')}</InfoLabel>
                                    <InfoValue>{convertDayOfWeek(scheduleItem.dayOfWeek)}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.startLesson')}</InfoLabel>
                                    <InfoValue>{scheduleItem.startLessonTime.lessonNumber}</InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.numberOfLesson')}</InfoLabel>
                                    <InfoValue>
                                        {scheduleItem.endLessonTime.lessonNumber - scheduleItem.startLessonTime.lessonNumber + 1}
                                    </InfoValue>
                                </p>
                                <p>
                                    <InfoLabel>{t('timetable.toolTip.instructor')}</InfoLabel>
                                    <InfoValue>{scheduleItem.instructor.user.fullName}</InfoValue>
                                </p>
                            </>
                        )}
                    </TooltipBody>
                </div>
            }
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 12],
                        },
                    },
                ],
            }}
            followCursor
        >
            <div style={{ width: '100%', height: '100%' }}>
                {children}
            </div>
        </Tooltip>
    );
};

export default CustomTooltip;