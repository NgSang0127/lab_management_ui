import React from 'react';
import {
    Box,
    Typography,
    Container,
    Divider,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
} from '@mui/material';
import {School, People, Computer, Event, BarChart, ArrowForward, Notifications} from '@mui/icons-material';
import {motion} from 'framer-motion';
import { IMAGE_ABOUT_US } from '../../assets/link/ImageAboutUs';

const fadeInUp = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.6},
};

const AboutUs: React.FC = () => {
    return (
        <Box sx={{bgcolor: '#f5f7fa', minHeight: '100vh', py: 8}}>
            <Container maxWidth="lg">
                {/* Header */}
                <motion.div {...fadeInUp}>
                    <Box sx={{textAlign: 'center', mb: 6}}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 2,
                                fontSize: {xs: '2.5rem', md: '3.5rem'},
                            }}
                        >
                            About Us
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                mb: 3,
                                fontSize: {xs: '1.2rem', md: '1.5rem'},
                            }}
                        >
                            Lab Management System – International University (IU), Vietnam National University HCMC
                        </Typography>
                        <Box
                            component="img"
                            src={IMAGE_ABOUT_US}
                            alt="Lab Banner"
                            sx={{
                                width: '100%',
                                maxHeight: '300px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </Box>
                </motion.div>

                <Divider sx={{mb: 8, borderColor: 'primary.main', borderWidth: '2px'}}/>

                {/* Section 1: Giới thiệu chi tiết */}
                <motion.div {...fadeInUp}>
                    <Box sx={{mb: 8}}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 3,
                                fontSize: {xs: '1.8rem', md: '2.2rem'},
                            }}
                        >
                            Introduction to IU Lab Management System
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary', mb: 3, lineHeight: 1.8}}>
                            The IU Lab Management System is a pioneering project developed by the Faculty of Information
                            Technology at International University (IU), a member of Vietnam National University Ho Chi
                            Minh City. Launched in 2025, this system is designed to address the growing need for
                            efficient management of laboratory resources in a modern academic environment. With a focus
                            on streamlining lab scheduling, asset management, and user coordination, the system ensures
                            that IU's state-of-the-art labs are utilized effectively to support both teaching and
                            research activities. By leveraging cutting-edge technology, the IU Lab Management System
                            aims to set a new standard for academic resource management in Vietnam's higher education
                            sector.
                        </Typography>
                    </Box>
                </motion.div>

                {/* Section 2: Mục đích */}
                <motion.div {...fadeInUp}>
                    <Box sx={{mb: 8}}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 3,
                                fontSize: {xs: '1.8rem', md: '2.2rem'},
                            }}
                        >
                            Our Purpose
                        </Typography>
                        <Card
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease',
                                '&:hover': {transform: 'translateY(-5px)'},
                            }}
                        >
                            <CardContent>
                                <List>
                                    {[
                                        'Optimize the management and scheduling of lab usage within the Faculty of Information Technology at IU.',
                                        'Minimize scheduling conflicts and enhance resource utilization efficiency to ensure smooth academic operations.',
                                        'Support the management of IT assets and equipment for each lab, enabling better tracking and maintenance.',
                                    ].map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <ArrowForward sx={{color: 'primary.main', fontSize: '1.5rem'}}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item}
                                                slotProps={{
                                                    primary: {
                                                        fontSize: '1.1rem', color: 'text.primary'
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                </motion.div>

                {/* Section 3: Đối tượng sử dụng */}
                <motion.div {...fadeInUp}>
                    <Box sx={{mb: 8}}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 3,
                                fontSize: {xs: '1.8rem', md: '2.2rem'},
                            }}
                        >
                            Target Users
                        </Typography>
                        <Grid container spacing={3}>
                            {[
                                {
                                    icon: <People/>,
                                    role: 'Admin',
                                    desc: 'Manages the entire system, oversees lab operations, and ensures compliance with university policies.',
                                },
                                {
                                    icon: <School/>,
                                    role: 'Teacher',
                                    desc: 'Schedules and manages classes in the lab, ensuring resources are available for teaching and research.',
                                },
                                {
                                    icon: <People/>,
                                    role: 'Student',
                                    desc: 'Checks class schedules, requests lab usage for projects, or borrows equipment for academic purposes.',
                                },
                                {
                                    icon: <Computer/>,
                                    role: 'Technician',
                                    desc: 'Monitors and maintains lab equipment, ensuring all devices are operational and up-to-date.',
                                },
                            ].map((user, index) => (
                                <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
                                    <Card
                                        sx={{
                                            bgcolor: 'white',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '12px',
                                            height: '100%',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {transform: 'translateY(-5px)'},
                                        }}
                                    >
                                        <CardContent sx={{textAlign: 'center'}}>
                                            <Box sx={{color: 'primary.main', mb: 2, fontSize: '2.5rem'}}>
                                                {user.icon}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    mb: 1,
                                                    color: 'text.primary',
                                                }}
                                            >
                                                {user.role}
                                            </Typography>
                                            <Typography variant="body2" sx={{color: 'text.secondary', lineHeight: 1.6}}>
                                                {user.desc}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>

                {/* Section 4: Tính năng chính */}
                <motion.div {...fadeInUp}>
                    <Box sx={{mb: 8}}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 3,
                                fontSize: {xs: '1.8rem', md: '2.2rem'},
                            }}
                        >
                            Key Features
                        </Typography>
                        <Card
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease',
                                '&:hover': {transform: 'translateY(-5px)'},
                            }}
                        >
                            <CardContent>
                                <List>
                                    {[
                                        {
                                            text: 'Schedule lab usage by week or semester with an intuitive calendar interface.',
                                            icon: <Event/>,
                                        },
                                        {
                                            text: 'Manage equipment and software for each lab, including inventory tracking and status updates.',
                                            icon: <Computer/>,
                                        },
                                        {
                                            text: 'Manage users with role-based permissions, ensuring secure access control.',
                                            icon: <People/>,
                                        },
                                        {
                                            text: 'Send notifications and maintenance alerts for equipment to prevent downtime.',
                                            icon: <Notifications/>,
                                        },
                                        {
                                            text: 'Generate detailed statistics and charts on lab access, usage, assets, and user activity.',
                                            icon: <BarChart/>,
                                        },
                                    ].map((feature, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Box sx={{color: 'primary.main', fontSize: '1.5rem', mr: 2}}>
                                                    {feature.icon}
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={feature.text}
                                                slotProps={{
                                                    primary:
                                                        {
                                                            fontSize: '1.1rem', color: 'text.primary'
                                                        }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                </motion.div>

                {/* Section 5: Tầm nhìn */}
                <motion.div {...fadeInUp}>
                    <Box sx={{textAlign: 'center', mb: 6}}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 3,
                                fontSize: {xs: '1.8rem', md: '2.2rem'},
                            }}
                        >
                            Our Vision
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto',
                                lineHeight: 1.8,
                                fontSize: '1.1rem',
                            }}
                        >
                            We envision the IU Lab Management System evolving into a comprehensive digital platform that
                            not only serves the Faculty of Information Technology but also sets a benchmark for academic
                            resource management across Vietnam. By integrating advanced technologies such as AI for
                            predictive scheduling and IoT for real-time equipment monitoring, we aim to support the
                            digital transformation of academic management, learning, and equipment oversight in
                            educational institutions. Our goal is to empower IU to lead the way in innovative education
                            and research through efficient and sustainable lab management practices.
                        </Typography>
                    </Box>
                </motion.div>

                {/* Call to Action */}
                <motion.div {...fadeInUp}>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                color: 'text.primary',
                                mb: 3,
                            }}
                        >
                            Join Us in Transforming Academic Resource Management
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: '8px',
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                            }}
                        >
                            Learn More About IU
                        </Button>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AboutUs;