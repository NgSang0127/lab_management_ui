import type {} from '@mui/material/themeCssVarsAugmentation';
import { ThemeOptions, PaletteMode } from '@mui/material/styles';
import { getDesignTokens } from './themePrimitives';
import {
    dataDisplayCustomizations,
    feedbackCustomizations,
    inputsCustomizations,
    navigationCustomizations, surfacesCustomizations,dataGridCustomizations
} from "./customizations";


export default function getTheme(mode: PaletteMode): ThemeOptions {
    return {
        ...getDesignTokens(mode),
        components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...dataGridCustomizations
        },
    };
}

