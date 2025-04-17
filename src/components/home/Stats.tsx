import React from 'react';
import { Box, Container,Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ComputerIcon from '@mui/icons-material/Computer';
import ScienceIcon from '@mui/icons-material/Science';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import {useTranslation} from "react-i18next";

const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[6],
    },
}));

const statsData = [
    {
        icon: <ComputerIcon fontSize="large" color="primary" />,
        number: '50+',
        label: 'home.stats.label1',
    },
    {
        icon: <ScienceIcon fontSize="large" color="primary" />,
        number: '20+',
        label: 'home.stats.label2',
    },
    {
        icon: <PeopleIcon fontSize="large" color="primary" />,
        number: '100+',
        label: 'home.stats.label3',
    },
    {
        icon: <EventIcon fontSize="large" color="primary" />,
        number: '30+',
        label: 'home.stats.label4',
    },
];

const Stats: React.FC = () => {
    const {t}=useTranslation();
    return (
        <Box py={8} bgcolor="background.default">
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {statsData.map((stat, index) => (
                        <Grid size={{xs: 12, md: 3, sm: 6}} key={index}>
                            <StatCard>
                                {stat.icon}
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                                    {stat.number}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {t(`${stat.label}`)}
                                </Typography>
                            </StatCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Stats;
