import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTranslation} from "react-i18next";


const FAQ: React.FC = () => {
    const { t } = useTranslation();

    const faqs = [
        {
            question: t('home.faq.equipment'),
            answer: t('home.faq.equipment_answer'),
        },
        {
            question: t('home.faq.register'),
            answer: t('home.faq.register_answer'),
        },
        {
            question: t('home.faq.research'),
            answer: t('home.faq.research_answer'),
        },
    ];
    return (
        <Box py={8} bgcolor="#f9f9f9">
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('home.faq.title')}
                </Typography>
                <Box mt={4}>
                    {faqs.map((faq, index) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                            >
                                <Typography variant="h6">{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1" color="textSecondary">
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default FAQ;
