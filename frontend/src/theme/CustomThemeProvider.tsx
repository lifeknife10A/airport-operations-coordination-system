import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

// We leave this context strictly as a stub to avoid breaking anything that might still reference it outside our edits.
// But it forces dark mode to always be true.
const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: true,
    toggleTheme: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Only dark theme is provided now
    const contextValue = useMemo(() => ({
        isDarkMode: true,
        toggleTheme: () => {},
    }), []);

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
