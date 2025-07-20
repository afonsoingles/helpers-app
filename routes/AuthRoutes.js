import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/auth/Login';
import SignupScreen from '../pages/auth/Signup';
import DeleteScreen from '../pages/auth/delete';
import SuspendedScreen from '../pages/auth/Suspended';

import { useRoute } from '@react-navigation/native';
const AuthStack = createStackNavigator();

function AuthRoutes() {
  const route = useRoute();
  console.log(route);

  useEffect(() => {
    const backAction = () => {
      if (route?.name === 'MainRoutes' && route?.params.screen === 'Setup' || route?.name === 'AuthRoutes' && route?.params.screen === 'Suspended' || route?.params.screen === 'PendingApproval' && route.name === 'AuthRoutes' ) {
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [route]);

  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <AuthStack.Screen
        name="Delete"
        component={DeleteScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <AuthStack.Screen
        name="Suspended"
        component={SuspendedScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthRoutes;