import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Index from './src/pages/Index';
import Travel from './src/pages/Travel';
import Plane from './src/pages/Plane';
import Hotels from './src/pages/Hotels';
import Beauty from './src/pages/Beauty';
import Events from './src/pages/Events';
import NotFound from './src/pages/NotFound';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
  );
}
