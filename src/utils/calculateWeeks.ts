import { addDays, format, isBefore } from 'date-fns';

const calculateWeeks = (firstWeekStart: string, lastWeekEnd: string) => {
    const weeksArray = [];
    const currentWeekStart = new Date(firstWeekStart);
    const end = new Date(lastWeekEnd);

    while (isBefore(currentWeekStart, addDays(end, 1))) {
        const currentWeekEnd = addDays(currentWeekStart, 6);
        weeksArray.push({
            startDate: format(currentWeekStart, 'dd/MM/yyyy'),
            endDate: format(currentWeekEnd, 'dd/MM/yyyy'),
        });

        currentWeekStart.setTime(addDays(currentWeekStart, 7).getTime());
    }
    return weeksArray;
};

export default calculateWeeks;
