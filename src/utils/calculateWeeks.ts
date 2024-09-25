const calculateWeeks = (firstWeekStart: string, lastWeekEnd: string) => {
    const weeksArray = [];
    const currentWeekStart = new Date(firstWeekStart);
    const end = new Date(lastWeekEnd);

    while (currentWeekStart <= end) {
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

        weeksArray.push({
            startDate: currentWeekStart.toLocaleDateString('en-GB'),
            endDate: currentWeekEnd.toLocaleDateString('en-GB'),
        });
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    return weeksArray;
};
export default calculateWeeks;