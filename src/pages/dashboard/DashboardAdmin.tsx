import React, {useContext} from "react";
import SidebarAdmin from "../../components/sidebar/SidebarAdmin.tsx";
import { Box} from "@mui/material";
import { Outlet } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext.tsx";

const DashboardAdmin: React.FC = () => {

    const { isSidebarOpen } = useContext(SidebarContext);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr", // Mobile: chỉ 1 cột
                    sm: isSidebarOpen ? "250px 1fr" : "50px 1fr", // Desktop: SidebarAdmin chiếm 250px hoặc 50px
                },
                minHeight: "100vh",
                gap: 1,
                transition: "grid-template-columns 0.3s ease-in-out", // Hiệu ứng mượt khi thay đổi chiều rộng
            }}
        >
            {/* SidebarAdmin */}
            <Box
                sx={{
                    padding: 1,
                    display: { xs: "none", sm: "block" }, // Ẩn sidebar trên màn hình nhỏ
                    transition: "width 0.3s ease-in-out", // Hiệu ứng chiều rộng
                }}
            >
                <SidebarAdmin />
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    padding: 4,
                    gridColumn: "2",
                    overflowX: "hidden", // Ngăn cuộn ngang
                    maxWidth: "100%", // Đảm bảo nội dung không vượt quá khung
                    transition: "max-width 0.3s ease-in-out", // Hiệu ứng khi thay đổi chiều rộng
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardAdmin;
