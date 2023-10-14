import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './app/constants/routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabNavigation from './app/components/tab-navigator';
import UmiProvider from './app/providers/umi-provider';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <UmiProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.TAB.INDEX} component={TabNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </UmiProvider>
  );
}
