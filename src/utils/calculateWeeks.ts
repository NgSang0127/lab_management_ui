import { addDays, format, isBefore, parse } from 'date-fns';

const calculateWeeks = (startDate: string, endDate: string): Array<{ startDate: string; endDate: string }> => {
    const weeks: Array<{ startDate: string; endDate: string }> = [];
    let currentStart = parse(startDate, 'dd/MM/yyyy', new Date());
    const end = parse(endDate, 'dd/MM/yyyy', new Date());

    while (isBefore(currentStart, addDays(end, 1))) {
        const weekEnd = addDays(currentStart, 6);
        weeks.push({
            startDate: format(currentStart, 'dd/MM/yyyy'),
            endDate: format(weekEnd, 'dd/MM/yyyy'),
        });
        currentStart = addDays(currentStart, 7);
    }

    return weeks;
};

export default calculateWeeks;