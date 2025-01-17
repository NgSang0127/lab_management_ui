import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Link,
    Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import ComputerIcon from '@mui/icons-material/Computer';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {testimonials, topNews} from "./topEvent.ts";
import ContactForm from "./ContactForm.tsx";
import Stats from "./Stats.tsx";
import Gallery from "./Gallery.tsx";
import FAQ from "./FAQ.tsx";


// Styled components
const FeatureCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    textAlign: 'center',
    padding: theme.spacing(3),
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[6],
    },
}));

const NewsCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: theme.palette.grey[100],
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
}));

const Home: React.FC = () => {
    return (
        <Box>
            {/* Introduction Section */}
            <Box py={8} bgcolor="#f9f9f9">
                <Container maxWidth="md">
                    <Typography variant="h3" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        Welcome to the International University IT Lab
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        Our labs provide modern facilities and a professional learning environment to support students and faculty in their research and projects.
                    </Typography>
                    <Box textAlign="center" mt={4}>
                        <Button variant="contained" color="primary" size="large" href="#features"
                                startIcon={<ScienceIcon/>}>
                            Learn More
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Statistics Section */}
            <Stats/>

            {/* Features Section */}
            <Box py={8} id="features" bgcolor="#ffffff">
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        Main Functions
                    </Typography>
                    <Grid container spacing={4} mt={4} justifyContent="center">
                        <Grid size={{xs: 12, md: 3, sm: 6}}>
                            <FeatureCard>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <ComputerIcon fontSize="large" color="primary"/>
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                        Device Management
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Monitor and manage lab equipment efficiently and accurately.
                                    </Typography>
                                </CardContent>
                            </FeatureCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 3, sm: 6}}>
                            <FeatureCard>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <ScienceIcon fontSize="large" color="primary"/>
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                        Project Management
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Support the management of research and development projects in the laboratory.
                                    </Typography>
                                </CardContent>
                            </FeatureCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 3, sm: 6}}>
                            <FeatureCard>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <PeopleIcon fontSize="large" color="primary"/>
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                        Member Management
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Manage information and roles of lab members.
                                    </Typography>
                                </CardContent>
                            </FeatureCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 3, sm: 6}}>
                            <FeatureCard>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <EventIcon fontSize="large" color="primary"/>
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                        Timetable Management
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Support viewing and scheduling effective schedules for lab activities.
                                    </Typography>
                                </CardContent>
                            </FeatureCard>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Gallery Section */}
            <Gallery/>

            {/* News Section */}
            <Box py={8} bgcolor="#f9f9f9">
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        News and Events
                    </Typography>
                    <Grid container spacing={4} mt={4}>
                        {topNews.map((news, index) => (
                            <Grid size={{xs: 12, md: 6}} key={index}>
                                <NewsCard>
                                    <CardMedia
                                        component="img"
                                        sx={{width: 160}}
                                        image={news.image}
                                        alt={news.title}
                                    />
                                    <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                        <CardContent>
                                            <Typography component="div" variant="h6" sx={{fontWeight: 'medium'}}>
                                                {news.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {news.description}
                                            </Typography>
                                            <Box mt={2}>
                                                <Button size="small" color="primary" href="#">
                                                    Read More
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </NewsCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box py={8}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        User Feedback
                    </Typography>
                    <Grid container spacing={4} mt={4} justifyContent="center">
                        {testimonials.map((testimonial, index) => (
                            <Grid size={{xs: 12, md: 6}} key={index}>
                                <TestimonialCard>
                                    <Avatar
                                        alt={testimonial.name}
                                        src={testimonial.avatar}
                                        sx={{width: 80, height: 80, margin: '0 auto', mb: 2}}
                                    />
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                        {testimonial.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                        {testimonial.position}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        "{testimonial.feedback}"
                                    </Typography>
                                </TestimonialCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FAQ Section */}
            <FAQ />
            {/* Contact Section */}
            <Box py={8} bgcolor="#ffffff">
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        Contact Us
                    </Typography>
                    <Grid container spacing={4} mt={4}>
                        <Grid size={{xs: 12, md: 6}}>
                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                <ContactMailIcon fontSize="large" color="primary"/>
                                <Typography variant="h6" gutterBottom mt={2} sx={{fontWeight: 'medium'}}>
                                    Contact Information
                                </Typography>
                                <Typography variant="body1" color="textSecondary" paragraph>
                                    Address: Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Phone Number: (028) 37244270
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Email: <Link href="mailto:info@hcmiu.edu.vn" color="primary.light"
                                                 underline="hover">info@hcmiu.edu.vn</Link>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                    Send Message
                                </Typography>
                                <ContactForm/>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
export default Home;