import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CarouselItemProps {
    image: string;
    title: string;
    description: string;
    link?: string;
}

const TextContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(4),
    left: theme.spacing(4),
    right: theme.spacing(4),
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền đen nhẹ để chữ dễ đọc
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(2),
        left: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const CarouselItem: React.FC<CarouselItemProps> = ({ image, title, description, link }) => {
    return (
        <Box position="relative" width="100%" height={{ xs: '200px', sm: '400px', md: '500px' }}>
            <img
                src={image}
                alt={title}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                }}
            />
            <TextContainer>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                    {title}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                    {description}
                </Typography>
                {link && (
                    <Button variant="contained" color="primary" component={Link} href={link}>
                        Read More
                    </Button>
                )}
            </TextContainer>
        </Box>
    );
};

export default CarouselItem;
