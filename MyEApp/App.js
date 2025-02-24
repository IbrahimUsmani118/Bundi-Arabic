import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Index} />
          <Stack.Screen name="Travel" component={Travel} />
          <Stack.Screen name="Plane" component={Plane} />
          <Stack.Screen name="Hotels" component={Hotels} />
          <Stack.Screen name="Beauty" component={Beauty} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="NotFound" component={NotFound} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
