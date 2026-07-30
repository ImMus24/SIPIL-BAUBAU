import React, { createContext, useContext } from 'react';
import type { ThemeVariant } from './types';

interface IllustrationThemeContextType {
  variant: ThemeVariant;
}

const IllustrationThemeContext = createContext<IllustrationThemeContextType>({ variant: 'light' });

export const useIllustrationVariant = (): ThemeVariant => {
  const ctx = useContext(IllustrationThemeContext);
  return ctx.variant;
};

interface IllustrationThemeProps {
  variant?: ThemeVariant;
  children: React.ReactNode;
}

export const IllustrationTheme: React.FC<IllustrationThemeProps> = ({
  variant = 'light',
  children,
}) => (
  <IllustrationThemeContext.Provider value={{ variant }}>
    {children}
  </IllustrationThemeContext.Provider>
);
