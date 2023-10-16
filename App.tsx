import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './app/constants/routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './app/types/navigation';
import UmiProvider from './app/providers/umi-provider';
import {
  EventScreen,
  QRScannerScreen,
  TicketScreen,
} from './app/components/screens';
import {
  CreateEventNavigator,
  BottomTabNavigator,
} from './app/components/navigators';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  return (
    <UmiProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name={ROUTES.TAB.INDEX}
              component={BottomTabNavigator}
            />
            <Stack.Screen name={ROUTES.TICKET} component={TicketScreen} />
            <Stack.Screen name={ROUTES.EVENT} component={EventScreen} />
            <Stack.Screen
              name={ROUTES.QR_SCANNER}
              component={QRScannerScreen}
            />
            <Stack.Screen
              name={ROUTES.CREATE_EVENT.INDEX}
              component={CreateEventNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </UmiProvider>
  );
}
