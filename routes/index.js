import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainRoutes" component={MainRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="AuthRoutes" component={AuthRoutes} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;