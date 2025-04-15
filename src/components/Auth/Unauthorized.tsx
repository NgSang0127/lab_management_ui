import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';


const UnauthorizedContainer = styled(Box)(() => ({
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}));

const ErrorCode = styled(Typography)(() => ({
    fontSize: '6rem',
    fontWeight: 'bold',
    color: '#d32f2f',
}));

const ActionButton = styled(Button)(() => ({
    marginTop: '16px',
    padding: '10px 24px',
}));

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    }

    const handleLogin = () => {
        navigate('/account/signin');
    };

    return (
        <UnauthorizedContainer className="p-4">
            <ErrorCode variant="h1">403</ErrorCode>
            <Typography variant="h4" className="text-gray-800 mt-4">
                Không có quyền truy cập
            </Typography>
            <Typography variant="body1" className="text-gray-600 pt-2 text-center max-w-md">
                Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại thông tin đăng nhập hoặc liên hệ
                quản trị viên để được hỗ trợ.
            </Typography>
            <Box className="flex gap-4 mt-6">
                <ActionButton
                    variant="contained"
                    color="primary"
                    onClick={handleGoBack}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Quay về trang chủ
                </ActionButton>
                <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleLogin}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                    Đăng nhập
                </ActionButton>
            </Box>
        </UnauthorizedContainer>
    );
};


export default Unauthorized;