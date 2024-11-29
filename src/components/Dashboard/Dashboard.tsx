import React, { useState } from "react";
import Sidebar from "./Sidebar";
import LogTable from "./LogTable.tsx";
import { Box } from "@mui/material";

const Dashboard: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr", // 1 column for mobile
                    sm: isSidebarOpen ? "250px 1fr" : "0 1fr", // Adjust grid when sidebar is open/closed
                },
                minHeight: "100vh",
                gap: 1,
                transition: "grid-template-columns 0.3s ease-in-out", // Smooth transition for resizing
            }}
        >
            {/* Sidebar */}
            <Box sx={{ padding: 1, transition: "width 0.3s ease-in-out" }}>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </Box>

            {/* Main content */}
            <Box
                sx={{
                    padding: 4,
                    marginLeft: isSidebarOpen ? "10px" : "50px", // Add margin when sidebar is open
                    transition: "margin-left 0.3s ease-in-out", // Smooth transition for margin change
                }}
            >
                <LogTable />
            </Box>
        </Box>
    );
};

export default Dashboard;
