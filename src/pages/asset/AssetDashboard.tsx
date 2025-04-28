import React, {useEffect} from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Grid,
    Container,
    styled,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    LocationOn as LocationIcon,
    Category as CategoryIcon,
    People as PeopleIcon,
    Build as BuildIcon,
    ImportExport as ImportExportIcon,
    MeetingRoom as RoomIcon,
    Code as CodeIcon,
    AccountCircle as AccountCircleIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../../state/store.ts';
import {Outlet} from 'react-router-dom';
import {Helmet} from "react-helmet-async";

const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({theme, isActive}) => ({
    background: isActive
        ? `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
        : theme.palette.background.default,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: isActive
        ? '0 6px 16px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: isActive ? `1px solid ${theme.palette.primary.dark}` : 'none',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        '& .MuiTypography-root': {
            color: theme.palette.primary.contrastText,
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText,
        },
    },
    height: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        height: '120px',
    },
    '& .MuiTypography-root': {
        color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
    },
    '& .MuiSvgIcon-root': {
        color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
    },
}));

const AssetDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    // Danh sách mục dashboard
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dashboardItems = [
        {
            label: 'Asset',
            path: 'asset',
            icon: <DashboardIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'View and manage all assets',
            adminOnly: true,
        },
        {
            label: 'Location',
            path: 'location',
            icon: <LocationIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'View and manage locations',
            adminOnly: true,
        },
        {
            label: 'Category',
            path: 'category',
            icon: <CategoryIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'Organize assets by categories',
            adminOnly: true,
        },
        {
            label: 'Manager',
            path: 'manager',
            icon: <PeopleIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'Manage asset managers',
            adminOnly: true,
        },
        {
            label: 'Maintenance',
            path: 'maintenance',
            icon: <BuildIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'Track maintenance activities',
            adminOnly: true,
        },
        {
            label: 'Import-Export',
            path: 'import-export',
            icon: <ImportExportIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'Handle asset import/export',
            adminOnly: true,
        },
        {
            label: 'Room',
            path: 'room',
            icon: <RoomIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'Manage rooms and their assets',
            adminOnly: true,
        },
        {
            label: 'Software',
            path: 'software',
            icon: <CodeIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'Manage software licenses and assets',
            adminOnly: true,
        },
        {
            label: 'Borrowing',
            path: 'borrow',
            icon: <HistoryIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'View borrowing history',
        },
        {
            label: 'My Assets',
            path: 'asset-user',
            icon: <AccountCircleIcon sx={{fontSize: {xs: 28, sm: 32}}}/>,
            description: 'View your assigned assets',
        },
    ];

    // Chuyển hướng mặc định
    useEffect(() => {
        const currentPath = location.pathname.split('/').pop();
        if (!dashboardItems.some((item) => item.path === currentPath)) {
            navigate('asset', {replace: true});
        }
    }, [location.pathname, navigate, dashboardItems]);

    return (
        <>
            <Helmet>
                <title>Assets | Lab Management IT</title>
            </Helmet>
            <Container
                maxWidth="xl"
                sx={{
                    py: 4,
                    px: {xs: 2, sm: 3},
                    minWidth: '100%', // Loại bỏ minWidth cố định
                }}
            >
                <Box sx={{ mb: 5, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1.5,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        }}
                    >
                        Asset Management
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                        }}
                    >
                        Streamline scheduling and semester planning with intuitive tools designed for efficiency.
                    </Typography>
                </Box>
                <Grid container spacing={{xs: 2, sm: 3}} sx={{mb: 4}}>
                    {dashboardItems.map((item) => {
                        // Ẩn mục admin-only nếu không phải admin
                        if (item.adminOnly && currentUser?.role !== 'ADMIN') return null;

                        // Xác định card active
                        const isActive = location.pathname.endsWith(item.path);

                        return (
                            <Grid
                                size={{xs: 12, sm: 6, md: 4, lg: 3}}
                                key={item.path}
                            >
                                <StyledCard isActive={isActive}>
                                    <CardActionArea
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{mb: 1}}>{item.icon}</Box>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontSize: {xs: '1rem', sm: '1.1rem'},
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontSize: {xs: '0.75rem', sm: '0.85rem'},
                                                }}
                                            >
                                                {item.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </StyledCard>
                            </Grid>
                        );
                    })}
                </Grid>

                <Box sx={{mt: 2}}>
                    <Outlet/>
                </Box>
            </Container>
        </>
    );
};

export default AssetDashboard;