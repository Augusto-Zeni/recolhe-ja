import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text } from 'react-native';

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

  // Lazy loading dos componentes para evitar ciclos de dependência
  const HomeComponent = React.lazy(() => import('@/app/home').then(module => ({ default: module.Home })));
  const ClassificationComponent = React.lazy(() => import('@/app/classification').then(module => ({ default: module.Classification })));
  const MapComponent = React.lazy(() => import('@/app/map').then(module => ({ default: module.Map })));
  const EventsComponent = React.lazy(() => import('@/app/events').then(module => ({ default: module.Events })));
  const HistoryComponent = React.lazy(() => import('@/app/history').then(module => ({ default: module.History })));
  const ProfileComponent = React.lazy(() => import('@/app/profile').then(module => ({ default: module.Profile })));

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeComponent />;
      case 'classification':
        return <ClassificationComponent />;
      case 'map':
        return <MapComponent />;
      case 'events':
        return <EventsComponent />;
      case 'history':
        return <HistoryComponent />;
      case 'profile':
        return <ProfileComponent />;
      default:
        return <HomeComponent />;
    }
  };

  return (
    <React.Suspense fallback={
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    }>
      {renderScreen()}
    </React.Suspense>
  );
}
