import React from 'react';
import {Box, Typography, Button, Link} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';

interface CarouselItemProps {
    image: string;
    title: string;
    description: string;
    link?: string;
}

const TextContainer = styled(Box)(({theme}) => ({
    position: 'absolute',
    bottom: theme.spacing(2),
    left: '50%',
    transform: 'translateX(-50%)',
    minWidth: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    color: '#fffff8',
    [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(2),
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: '50%',
    },
}));

const CarouselItem: React.FC<CarouselItemProps> = ({image, title, description, link}) => {
    const {t} = useTranslation();

    return (
        <Box position="relative" width="100%" height={{xs: '200px', sm: '400px', md: '600px'}}>
            <img
                src={image}
                alt={title}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '0 0 8px 8px'

                }}
            />
            <TextContainer>
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        fontSize: {xs: '20px', sm: '30px', md: '35px'},
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                        fontSize:'16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {description}
                </Typography>
                {link && (
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        href={link}
                        sx={{
                            mt: 1,
                        }}
                    >
                        {t('home.read_more')}
                    </Button>
                )}
            </TextContainer>
        </Box>
    );
};

export default CarouselItem;