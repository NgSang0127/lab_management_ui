import React, { useEffect } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Grid,
    Container,
    styled,
    useTheme,
} from '@mui/material';
import {
    EventNote as TimetableIcon,
    CalendarToday as SemesterIcon,
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {useTranslation} from "react-i18next";

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
    background: isActive
        ? theme.palette.primary.main
        : theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: isActive
        ? `0 10px 30px ${theme.palette.primary.main}40`
        : `0 6px 18px ${theme.palette.grey[200]}`,
    border: `1px solid ${isActive ? theme.palette.primary.dark : theme.palette.grey[100]}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 14px 40px ${theme.palette.grey[400]}4D`,
        opacity: 0.85, // Fade effect on hover
    },
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        height: '180px',
    },
    '& .MuiTypography-root': {
        color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
        transition: 'color 0.3s ease',
    },
    '& .MuiSvgIcon-root': {
        color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.main,
        transition: 'color 0.3s ease',
    },
    '&:hover .MuiTypography-root': {
        color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
    },
    '&:hover .MuiSvgIcon-root': {
        color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.dark,
    },
}));

const TimetableDashboard: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const theme=useTheme();

    const dashboardItems = [
        {
            label: 'Timetable',
            path: 'timetable',
            icon: <TimetableIcon sx={{ fontSize: { xs: 40, sm: 42 } }} />,
            description: 'Effortlessly manage and view class schedules.',
        },
        {
            label: 'Semester',
            path: 'semester',
            icon: <SemesterIcon sx={{ fontSize: { xs: 40, sm: 42 } }} />,
            description: 'Configure academic semesters with ease.',
        },
    ];

    useEffect(() => {
        const currentPath = location.pathname.split('/').pop();
        if (!dashboardItems.some((item) => item.path === currentPath)) {
            navigate('timetable', { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <>
            <Helmet>
                <title>Timetable Dashboard | Lab Management IT</title>
            </Helmet>
            <Container
                maxWidth="xl"
                sx={{
                    py: { xs: 4, sm: 6 },
                    px: { xs: 2, sm: 4 },
                    minWidth: '100%',
                    bgcolor: 'background.default',
                }}
            >
                {/* Header Section */}
                <Box sx={{ mb: 6, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: { xs: 1, sm: 2 },
                            letterSpacing: -0.5,
                        }}
                    >
                        {t("timetable.title",{ defaultValue: 'Timetable Management' })}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            mb: { xs: 2, sm: 3, md: 4 },
                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        }}
                    >
                        Streamline scheduling and semester planning with intuitive, powerful tools.
                    </Typography>
                </Box>

                {/* Card Grid */}
                <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} sx={{ mb: 8 }}>
                    {dashboardItems.map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.path}>
                            <StyledCard isActive={location.pathname.endsWith(item.path)}>
                                <CardActionArea
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        p: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ mb: 2.5 }}>{item.icon}</Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                                                mb: 1.5,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                color: 'inherit',
                                                opacity: 0.9,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>

                {/* Outlet for Nested Routes */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        boxShadow: `0 4px 20px ${theme.palette.grey[200]}`,
                        border: `1px solid ${theme.palette.grey[100]}`,
                    }}
                >
                    <Outlet />
                </Box>
            </Container>
        </>
    );
};

export default TimetableDashboard;