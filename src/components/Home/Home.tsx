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
import {styled} from '@mui/material/styles';
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
import {useTranslation} from "react-i18next";


// Styled components
const FeatureCard = styled(Card)(({theme}) => ({
    maxWidth: 345,
    textAlign: 'center',
    padding: theme.spacing(3),
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[6],
    },
}));

const NewsCard = styled(Card)(({theme}) => ({
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

const TestimonialCard = styled(Card)(({theme}) => ({
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
    const {t} = useTranslation();
    return (
        <Box>
            {/* Introduction Section */}
            <Box py={8} bgcolor="#f9f9f9">
                <Container maxWidth="md">
                    <Typography variant="h3" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        {t('home.introduction.welcome')}
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        {t('home.introduction.introduce')}
                    </Typography>
                    <Box textAlign="center" mt={4}>
                        <Button variant="contained" color="primary" size="large" href="#features"
                                startIcon={<ScienceIcon/>}>
                            {t('home.introduction.learn_more')}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Statistics Section */}
            <Stats/>

            {/* Features Section */}
            <Box py={8} id="features-section" bgcolor="#ffffff">
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        {t('home.features.main_functions')}
                    </Typography>
                    <Grid container spacing={4} mt={4} justifyContent="center">
                        <Grid size={{xs: 12, md: 3, sm: 6}}>
                            <FeatureCard>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <ComputerIcon fontSize="large" color="primary"/>
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium'}}>
                                        {t('home.features.device_management')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('home.features.device_management_introduce')}
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
                                        {t('home.features.project_management')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('home.features.project_management_introduce')}
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
                                        {t('home.features.member_management')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('home.features.member_management_introduce')}
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
                                        {t('home.features.timetable_management')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {t('home.features.timetable_management_introduce')}                                    </Typography>
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
                        {t('home.news_and_events')}
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
                                                    {t('home.read_more')}
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
                        {t('home.user_feedback')}
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
            <FAQ/>
            {/* Contact Section */}
            <Box py={8} bgcolor="#ffffff" id="contact-section">
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                        {t('home.contact_us.title')}
                    </Typography>
                    <Grid container spacing={4} mt={4}>
                        <Grid size={{xs: 12, md: 6}}>
                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                <ContactMailIcon fontSize="large" color="primary"/>
                                <Typography variant="h6" gutterBottom mt={2} sx={{fontWeight: 'medium'}}>
                                    {t('home.contact_us.information')}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" paragraph>
                                    {t('home.contact_us.address')}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {t('home.contact_us.phone')}
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
                                    {t('home.contact_form.title')}
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