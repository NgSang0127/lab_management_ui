import { Theme, alpha, Components } from '@mui/material/styles';
import {gray, green, orange, red} from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
    MuiAlert: {
        styleOverrides: {
            root: ({ theme, ownerState }) => ({
                borderRadius: 10,
                backgroundColor: ownerState.severity === 'success'
                    ? green[100]
                    : ownerState.severity === 'error'
                        ? red[100]
                        : orange[100], // Default orange background
                color: theme.palette.text.primary,
                border: `1px solid ${alpha(ownerState.severity === 'success' ? green[300] : orange[300], 0.5)}`,
                '& .MuiAlert-icon': {
                    color: ownerState.severity === 'success'
                        ? green[500]
                        : ownerState.severity === 'error'
                            ? red[500]
                            : orange[500],
                },
                ...theme.applyStyles('dark', {
                    backgroundColor: `${alpha(ownerState.severity === 'success' ? green[900] : orange[900], 0.5)}`,
                    border: `1px solid ${alpha(ownerState.severity === 'success' ? green[800] : orange[800], 0.5)}`,
                }),
            }),
        },
    },
    MuiDialog: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiDialog-paper': {
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                },
            }),
        },
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: ({ theme }) => ({
                height: 8,
                borderRadius: 8,
                backgroundColor: gray[200],
                ...theme.applyStyles('dark', {
                    backgroundColor: gray[800],
                }),
            }),
        },
    },
};