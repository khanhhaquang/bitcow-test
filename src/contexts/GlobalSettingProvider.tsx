import { createContext, ReactNode, useCallback, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export enum Theme {
  Light = 'Light',
  Dark = 'Dark'
}

interface GlobalSettingContextType {
  theme: Theme;
  setTheme: (m: Theme) => void;
  loadTheme: () => void;
}

interface TProviderProps {
  children: ReactNode;
}

const GlobalSettingContext = createContext<GlobalSettingContextType>(
  {} as GlobalSettingContextType
);

const GlobalSettingProvider: React.FC<TProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('obric-theme', Theme.Dark);

  const loadTheme = useCallback(() => {
    const darkMode = theme === Theme.Dark;
    console.log('check theme', theme, darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    loadTheme();
  }, [theme]);

  return (
    <GlobalSettingContext.Provider
      value={{
        theme,
        setTheme,
        loadTheme
      }}>
      {children}
    </GlobalSettingContext.Provider>
  );
};

export { GlobalSettingProvider, GlobalSettingContext };
