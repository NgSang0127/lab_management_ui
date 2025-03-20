import { Typography, Container, Box, Button } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React from "react";
import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom";

const CheckEmail: React.FC = () => {
    const { t } = useTranslation();
    const navigate=useNavigate();
    return (
        <Container
            maxWidth="lg"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    p: 10,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: "background.paper",
                    width: "100%",
                }}
            >
                <EmailOutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
                <Typography variant="h5" fontWeight="bold">
                    {t("check_email.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t(
                        "check_email.content",
                    )}
                </Typography>
                <Button variant="contained" sx={{ mt: 2, width: "20%" }}
                onClick={() =>navigate("/")}
                >
                    {t("check_email.home", "Return to Home")}
                </Button>
            </Box>
        </Container>
    );
}
export default CheckEmail;