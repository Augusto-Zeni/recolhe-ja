import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Home } from '@/app/home';
import { Classification } from '@/app/classification';
import { Map } from '@/app/map';
import { Events } from '@/app/events';
import { History } from '@/app/history';
import { Profile } from '@/app/profile';

export type Screen = 'home' | 'classification' | 'map' | 'events' | 'history' | 'profile';

interface NavigationContextData {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextData>({} as NavigationContextData);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [navigationStack, setNavigationStack] = useState<Screen[]>(['home']);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setNavigationStack(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      setCurrentScreen(newStack[newStack.length - 1]);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextData {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de um NavigationProvider');
  }
  
  return context;
}

export function AppNavigator() {
  const { currentScreen } = useNavigation();

  switch (currentScreen) {
    case 'home':
      return <Home />;
    case 'classification':
      return <Classification />;
    case 'map':
      return <Map />;
    case 'events':
      return <Events />;
    case 'history':
      return <History />;
    case 'profile':
      return <Profile />;
    default:
      return <Home />;
  }
}
