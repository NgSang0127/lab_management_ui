import React, { createContext, useState, ReactNode} from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    showCustomTheme: boolean;
    toggleTheme: () => void;
    toggleCustomTheme: (isCustom: boolean) => void;
}

// Tạo giá trị mặc định cho context
const defaultThemeContextValue: ThemeContextType = {
    isDarkMode: false,
    showCustomTheme: true,
    toggleTheme: () => {},
    toggleCustomTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContextValue);

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() =>
        localStorage.getItem('theme') === 'dark'
    );
    const [showCustomTheme, setShowCustomTheme] = useState<boolean>(true);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const toggleCustomTheme = (isCustom: boolean) => {
        setShowCustomTheme(isCustom);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, showCustomTheme, toggleTheme, toggleCustomTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


