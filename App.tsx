/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from './src/constants/routes';
import TagIcon from './src/images/Tag.svg';
import TicketIcon from './src/images/Ticket.svg';
import ClipboardIcon from './src/images/ClipboardAdd.svg';
import TabHeader from './src/components/tab-header';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Home Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        header: props => <TabHeader {...props} />,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <TagIcon color={color} width={size} height={size} />
          ),
        }}
        name={ROUTES.TAB.AVAILABLE_EVENTS}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <TicketIcon color={color} width={size} height={size} />
          ),
        }}
        name={ROUTES.TAB.MY_TICKETS}
        component={SettingsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <ClipboardIcon color={color} width={size} height={size} />
          ),
        }}
        name={ROUTES.TAB.MY_EVENTS}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTES.TAB.INDEX} component={TabNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
