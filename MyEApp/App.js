import React from 'react';
import { Text, View, Button, I18nManager, Alert } from 'react-native';
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
      {/* Use the current language as a key to force re-render on language change */}
      <NavigationContainer key={i18n.language}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Index}
            options={{ title: t('home') }}
          />
          <Stack.Screen
            name="Travel"
            component={Travel}
            options={{ title: t('travel') }}
          />
          <Stack.Screen
            name="Plane"
            component={Plane}
            options={{ title: t('flights') }}
          />
          <Stack.Screen
            name="Hotels"
            component={Hotels}
            options={{ title: t('hotels') }}
          />
          <Stack.Screen
            name="Beauty"
            component={Beauty}
            options={{ title: t('beauty_services') }}
          />
          <Stack.Screen
            name="Events"
            component={Events}
            options={{ title: t('events') }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFound}
            options={{ title: t('not_found') }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Language Switcher */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
        <Button
          title="English"
          onPress={() => {
            console.log('Changing language to en');
            i18n.changeLanguage('en');
            I18nManager.forceRTL(false);
            I18nManager.allowRTL(false);
          }}
        />
        <Button
          title="العربية"
          onPress={() => {
            console.log('Changing language to ar');
            i18n.changeLanguage('ar');
            I18nManager.forceRTL(true);
            I18nManager.allowRTL(true);
            Alert.alert(
              "Restart Required",
              "Please reload the app to fully apply the right-to-left layout."
            );
          }}
        />
      </View>
    </QueryClientProvider>
  );
}
