import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import SignUp from "./SignUp.tsx";
import SignIn from "./SignIn.tsx";

const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxHeight: '100vh', // Giới hạn chiều cao tối đa của modal
    overflowY: 'auto', // Cho phép cuộn dọc
    transform: 'translate(-50%, -50%)',
    width: '80%', // Điều chỉnh kích thước modal
    maxWidth: 600, // Đặt kích thước tối đa cho modal
    bgcolor: 'rgba(255, 255, 255, 0.8)', // Nền của modal với độ trong suốt
    outline: 'none',
    boxShadow: 2,
    borderRadius: '7px', // Bo góc modal
};

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Log current path for debugging
    console.log("Current path:", location.pathname);

    const handleOnClose = () => {
        navigate("/");
    };

    return (
        <Modal
            open={location.pathname === "/account/signup" || location.pathname === "/account/signin"}
            onClose={handleOnClose}
        >
            <Box sx={style}>
                {location.pathname === "/account/signup" ? <SignUp /> : <SignIn />}
            </Box>
        </Modal>
    );
};

export default Auth;
