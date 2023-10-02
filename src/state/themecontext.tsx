import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the theme context
interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define a custom hook to access the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Define the ThemeProvider component
export const ThemeProvidered = (props: ThemeProviderProps) => {
  // Initialize the theme with the default value 'dark'
  const [theme, setTheme] = useState<string>('dark');

  // When the component mounts, try to get the theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Update localStorage with the theme whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};



