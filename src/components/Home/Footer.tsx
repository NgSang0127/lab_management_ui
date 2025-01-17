import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Link,
    Divider,
    Container,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import logoIT from "@images/logo2.png";


const FooterContainer = styled('footer')(({ theme }) => ({
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
}));


const SocialMediaContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
    },
}));

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <Container  maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Left Section - Contact Info */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="h6" gutterBottom>
                            International University - Vietnam National University HCMC
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Address: Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Phone Number: (028) 37244270
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Fax: (028) 37244271
                        </Typography>
                        <Typography variant="body2">
                            Email: <Link href="mailto:info@hcmiu.edu.vn" color="primary.light" underline="hover">info@hcmiu.edu.vn</Link>
                        </Typography>
                    </Grid>

                    {/* Right Section - Social Media Links */}
                    <Grid size={{xs:12,md:6}}>
                        <SocialMediaContainer>
                            <IconButton
                                component="a"
                                href="https://www.facebook.com/IUVNUHCMC"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                sx={{
                                    color: 'primary.main',
                                    transition: 'color 0.3s',
                                    '&:hover': {
                                        color: 'primary.light',
                                    },
                                }}
                            >
                                <FacebookIcon fontSize="large" />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://www.youtube.com/channel/UCTBixlLRDIIlpmR_Y7wmI3w"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                sx={{
                                    color: 'error.main',
                                    transition: 'color 0.3s',
                                    '&:hover': {
                                        color: 'error.light',
                                    },
                                }}
                            >
                                <YouTubeIcon fontSize="large" />
                            </IconButton>
                            <IconButton
                                component="a"
                                href="https://www.instagram.com/iuvnu.hcmc/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                sx={{
                                    color: 'secondary.main',
                                    transition: 'color 0.3s',
                                    '&:hover': {
                                        color: 'secondary.light',
                                    },
                                }}
                            >
                                <InstagramIcon fontSize="large" />
                            </IconButton>
                        </SocialMediaContainer>
                    </Grid>
                </Grid>

                {/* Divider */}
                <Box my={4}>
                    <Divider sx={{ backgroundColor: 'grey.700' }} />
                </Box>

                {/* Bottom Section - Logo and Copyright */}
                <Grid container spacing={4} alignItems="center">
                    {/* Logo */}
                    <Grid size={{xs:12,md:6}} display="flex" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                        <Box component="img" src={logoIT} alt="Logo Trường Đại học Quốc Tế" sx={{ width: { xs: 150, md: 320 }, height: 'auto' }} />
                    </Grid>

                    {/* Copyright */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="body2"  sx={{ color: 'grey.500' }}>
                            © 2024 School of Computer Science and Engineering. Designed by NCS
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </FooterContainer>
    );
};

export default Footer;
