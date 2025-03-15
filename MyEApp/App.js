import React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import './i18n/index'; // Import language configuration

import Index from './src/screens/Index';
import Travel from './src/screens/Travel';
import Plane from './src/screens/Plane';
import Hotels from './src/screens/Hotels';
import Beauty from './src/screens/Beauty';
import Events from './src/screens/Events';
import NotFound from './src/screens/NotFound';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Index} options={{ title: t('home') }} />
          <Stack.Screen name="Travel" component={Travel} options={{ title: t('travel') }} />
          <Stack.Screen name="Plane" component={Plane} options={{ title: t('flights') }} />
          <Stack.Screen name="Hotels" component={Hotels} options={{ title: t('hotels') }} />
          <Stack.Screen name="Beauty" component={Beauty} options={{ title: t('beauty_services') }} />
          <Stack.Screen name="Events" component={Events} options={{ title: t('events') }} />
          <Stack.Screen name="NotFound" component={NotFound} options={{ title: t('not_found') }} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Language Switcher */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
        <Button title="English" onPress={() => i18n.changeLanguage('en')} />
        <Button title="हिन्दी" onPress={() => i18n.changeLanguage('hi')} />
      </View>
    </QueryClientProvider>
  );
}
