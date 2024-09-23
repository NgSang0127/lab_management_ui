// Hàm chuyển đổi dayOfWeek từ tiếng Anh sang tiếng Việt
const convertDayOfWeekToVietnamese = (dayOfWeek: string): string => {
    const daysMap: { [key: string]: string } = {
        MONDAY: 'Thứ Hai',
        TUESDAY: 'Thứ Ba',
        WEDNESDAY: 'Thứ Tư',
        THURSDAY: 'Thứ Năm',
        FRIDAY: 'Thứ Sáu',
        SATURDAY: 'Thứ Bảy',
        SUNDAY: 'Chủ Nhật',
    };
    return daysMap[dayOfWeek] || dayOfWeek;
};

export default  convertDayOfWeekToVietnamese;