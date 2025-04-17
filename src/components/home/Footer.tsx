import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Link,
    Divider,
    Container, useMediaQuery, useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import logoIT from "@images/logo2.png";
import {useTranslation} from "react-i18next";



const FooterContainer = styled('footer')(({ theme }) => ({
    backgroundColor: theme.palette.grey[800],
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
    const {t}=useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <FooterContainer>
            <Container  maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Left Section - Contact Info */}
                    <Grid size={{xs:12,md:6}}>
                        <Typography variant="h6" gutterBottom>
                            {t('home.footer.title')}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {t('home.footer.address')}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {t('home.footer.phone')}
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
                        {/* Nhúng Google Maps iframe ở đây */}
                        <Grid
                            container
                            sx={{
                                mt: 2,
                                justifyContent: isMobile ? 'center' : 'flex-end',
                            }}
                        >
                            <Grid size={{ xs: 12, md: 10 }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1316505608092!2d106.79904467583916!3d10.877590057317947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a415a9d221%3A0x550c2b41569376f9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBRdeG7kWMgVOG6vyAtIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1743504507116!5m2!1svi!2s"
                                    width="100%"
                                    height="200"
                                    style={{ border: "0", borderRadius: "8px" }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </Grid>
                        </Grid>
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
