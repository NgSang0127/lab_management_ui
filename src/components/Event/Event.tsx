import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Chip,
    Container,
    Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import activitiesData from '../../utils/activities.json';

interface Event {
    title: string;
    url: string;
    author: string;
    date: string;
    views: number;
    excerpt: string;
    image?: string;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
    padding: '8px',
    overflowX: 'auto',
    '& .MuiTabs-flexContainer': {
        flexWrap: 'nowrap',
    },
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: '3px',
        borderRadius: '3px',
    },
    '& .MuiTabs-scroller': {
        overflowX: 'auto !important',
        '-webkit-overflow-scrolling': 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    padding: '12px 24px',
    borderRadius: '8px',
    marginRight: '12px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
    },
}));

const EventCard = styled(Card)(() => ({
    width: '100%',
    maxWidth: '550px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    },
}));

const EventDateChip = styled(Chip)(() => ({
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.85rem',
}));

const Event: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const filteredCategories = activitiesData.filter((cat) => cat.articles.length > 3);
    const categoryNames = Array.from(new Set(filteredCategories.map((cat) => cat.category)));

    React.useEffect(() => {
        if (categoryNames.length > 0) {
            setSelectedCategory(categoryNames[0]);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        }
    }, []);

    const filteredEvents = filteredCategories.find(
        (cat) => cat.category === selectedCategory
    )?.articles || [];

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setSelectedCategory(newValue);
            setIsLoading(false);
        }, 1000);
    };

    // Animation cho các card
    const cardAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    // Skeleton Loading Component
    const SkeletonCard = () => (
        <Box sx={{ width: '100%', maxWidth: '550px', p: 3 }}>
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '8px', mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="text" width={60} />
            </Box>
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="80%" />
        </Box>
    );

    // @ts-ignore
    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 8 }}>
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
                {/* Header */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        textAlign: 'center',
                        mb: 4,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                >
                    Upcoming Events
                </Typography>

                {/* Tabs */}
                {categoryNames.length > 0 ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <StyledTabs
                                value={selectedCategory}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    maxWidth: '100%',
                                    width: { xs: '100%', sm: 'auto' },
                                }}
                                slotProps={{
                                    scrollButton: {
                                        sx: {
                                            display: { xs: 'flex', sm: 'none' },
                                            color: 'primary.main',
                                            p: 1,
                                        },
                                    },
                                }}
                            >
                                {categoryNames.map((category) => (
                                    <StyledTab key={category} label={category} value={category} />
                                ))}
                            </StyledTabs>
                        </Box>

                        {/* Events Grid */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(5, 1fr)',
                                },
                                gap: 5,
                                justifyItems: 'center',
                                alignItems: 'stretch',
                            }}
                        >
                            {isLoading ? (
                                // Hiển thị Skeleton Loading
                                Array.from(new Array(5)).map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))
                            ) : filteredEvents.length > 0 ? (
                                filteredEvents.map((event: Event, index: number) => (
                                    <motion.div key={index} {...cardAnimation}>
                                        <EventCard>
                                            <CardContent sx={{ p: 3 }}>
                                                {/* Image (nếu có) */}
                                                {event.image && (
                                                    <Box
                                                        component="img"
                                                        src={event.image}
                                                        alt={event.title}
                                                        sx={{
                                                            width: '100%',
                                                            height: '150px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            mb: 2,
                                                        }}
                                                    />
                                                )}

                                                {/* Title */}
                                                <Typography
                                                    variant="h6"
                                                    component="a"
                                                    href={event.url}
                                                    target="_blank"
                                                    sx={{
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        fontWeight: 'bold',
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        mb: 1,
                                                        '&:hover': {
                                                            color: 'primary.dark',
                                                            textDecoration: 'underline',
                                                        },
                                                    }}
                                                >
                                                    {event.title}
                                                </Typography>

                                                {/* Date and Views */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <EventDateChip label={event.date} size="small" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {event.views} views
                                                    </Typography>
                                                </Box>

                                                {/* Author */}
                                                {event.author && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        Author: {event.author}
                                                    </Typography>
                                                )}

                                                {/* Excerpt */}
                                                {event.excerpt && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.primary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitBoxOrient: 'vertical',
                                                            WebkitLineClamp: 3,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {event.excerpt}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </EventCard>
                                    </motion.div>
                                ))
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        width: '100%',
                                        gridColumn: '1 / -1',
                                        color: 'text.secondary',
                                        py: 4,
                                    }}
                                >
                                    No events available in this category.
                                </Typography>
                            )}
                        </Box>
                    </>
                ) : (
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            width: '100%',
                            color: 'text.secondary',
                            py: 4,
                        }}
                    >
                        No categories with more than 3 articles available.
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default Event;