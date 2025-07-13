import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Setup from '../pages/Setup';
import Home from '../pages/Home';
import SettingsScreen from '../pages/Settings';

const Stack = createStackNavigator();

const MainRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Setup" component={Setup} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainRoutes;
