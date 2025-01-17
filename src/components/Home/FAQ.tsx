import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
    {
        question: 'What types of equipment does the lab support?',
        answer: 'Our lab supports equipment such as computers, 3D printers, chemical analysis devices, and many other research tools.',
    },
    {
        question: 'How do I register to use the lab?',
        answer: 'You can register to use the lab through our online management system or by directly contacting the lab administrator.',
    },
    {
        question: 'Does the lab support research projects?',
        answer: 'Yes, the lab provides technical support and facilities for student and faculty research projects.',
    },
];

const FAQ: React.FC = () => {
    return (
        <Box py={8} bgcolor="#f9f9f9">
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Frequently Asked Questions
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
