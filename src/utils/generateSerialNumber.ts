export const generateSerialNumber = () => {
    const now = new Date();

    // Lấy ngày, tháng, năm theo định dạng DDMMYYYY
    const day = now.getDate().toString().padStart(2, '0');  // Đảm bảo 2 chữ số
    const month = (now.getMonth() + 1).toString().padStart(2, '0');  // Tháng bắt đầu từ 0
    const year = now.getFullYear();

    // Lấy thời gian giờ, phút, giây
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Kết hợp thành serial number theo định dạng IU-DDMMYYYY-HHMMSS
    const serialNumber = `IU-${day}${month}${year}-${hours}${minutes}${seconds}`;

    return serialNumber;
};

// Kết quả ví dụ: "IU-27122024-151230" (ngày 27 tháng 12 năm 2024, giờ 15:12:30)
