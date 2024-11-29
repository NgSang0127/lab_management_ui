import { Typography, Box } from '@mui/material';
import React from "react";

const CheckEmail: React.FC = () => {
    return (
        <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4">Kiểm tra email của bạn</Typography>
            <Typography variant="body1">
                Chúng tôi đã gửi một email xác thực tới địa chỉ email của bạn.
                Vui lòng kiểm tra để nhận mã xác thực.
            </Typography>
        </Box>
    );
};

export default CheckEmail;
