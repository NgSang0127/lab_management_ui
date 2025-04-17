import React, { useEffect, useState } from 'react';
import {Button, useTheme} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const theme=useTheme();

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div style={{
            display: isVisible ? 'block' : 'none',
            position: 'fixed',
            bottom: '7px',
            right: '1px',
            zIndex: 1000
        }}>
            <Button
                onClick={scrollToTop}
                variant="contained"
                sx={{
                    backgroundColor: theme.palette.grey[800],
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '40px',
                    height: '40px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    padding: '0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        backgroundColor: theme.palette.grey[700],
                    },
                }}
            >
                <KeyboardArrowUpIcon sx={{ fontSize: 'px', color: theme.palette.grey[50] }} />
            </Button>
        </div>
    );
};

export default ScrollToTopButton;