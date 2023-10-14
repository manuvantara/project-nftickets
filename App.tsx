import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from './app/constants/routes';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabNavigation from './app/components/tab-navigator';
import { RootStackParamList } from './app/types/navigation';
import { QRScannerScreen, TicketScreen } from './app/components/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTES.TAB.INDEX} component={TabNavigation} />
          <Stack.Screen name={ROUTES.TICKET} component={TicketScreen} />
          <Stack.Screen name={ROUTES.QR_SCANNER} component={QRScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
