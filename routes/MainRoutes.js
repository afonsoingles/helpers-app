import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Setup from '../pages/Setup';

const Stack = createStackNavigator();

const MainRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Setup" component={Setup} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainRoutes;
