import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {useTranslation} from "react-i18next";


const galleryImages = [
    {
        img: 'https://edulinks.vn/wp-content/uploads/2019/06/saimaan-ammattikorkeakoulu2.jpg',
        title: 'Lab Room 1',
    },
    {
        img: 'https://www.iq.harvard.edu/sites/projects.iq.harvard.edu/files/styles/os_files_xlarge/public/harvard-iqss/files/img_0338_1.jpeg?m=1585925115&itok=VVBAgLJU',
        title: 'Lab Room 2',
    },
    {
        img: 'https://eurolinkedu.com/wp-content/uploads/2021/01/dai-hoc-khoa-hoc-ung-dung-lab-2.jpg',
        title: 'Research Seminar',
    },
    {
        img: 'https://www.engr.washington.edu/files/content/media/wilcox73.jpg',
        title: 'New Equipment',
    },

];

const Gallery: React.FC = () => {
    const {t}=useTranslation();
    return (
        <Box py={8}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('home.image_library')}
                </Typography>
                <Grid container spacing={4} mt={4} justifyContent="center">
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {galleryImages.map((item, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={`${item.img}?w=248&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid>
            </Container>
        </Box>
    );
};

export default Gallery;
