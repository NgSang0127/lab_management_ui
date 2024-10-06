import { addDays, format, isBefore, parse } from 'date-fns';

const calculateWeeks = (firstWeekStart: string, lastWeekEnd: string) => {
    const weeksArray = [];

    let currentWeekStart = parse(firstWeekStart, 'dd/MM/yyyy', new Date());
    const end = parse(lastWeekEnd, 'dd/MM/yyyy', new Date());

    while (isBefore(currentWeekStart, addDays(end, 1))) {
        const currentWeekEnd = addDays(currentWeekStart, 6);
        weeksArray.push({
            startDate: format(currentWeekStart, 'dd/MM/yyyy'),
            endDate: format(currentWeekEnd, 'dd/MM/yyyy'),
        });

        currentWeekStart = addDays(currentWeekStart, 7);
    }
    return weeksArray;
};

export default calculateWeeks;
