const getWeekRange=()=>{
    const currentDate = new Date(); // Ngày hiện tại
    const dayOfWeek = currentDate.getDay(); // Lấy số thứ tự ngày trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy)

    // Nếu là Chủ Nhật (0), ta điều chỉnh cho nó là 7 để dễ tính ngày bắt đầu từ Thứ Hai
    const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Tính ngày bắt đầu (Thứ Hai)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - adjustedDayOfWeek + 1);

    // Tính ngày kết thúc (Chủ Nhật)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format ngày dưới dạng 'YYYY-MM-DD'
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    return { startDate, endDate };
}
export  default  getWeekRange;