import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabHeader from '../tab-header';
import { ROUTES } from '../../constants/routes';
import {
  AvailableEventsScreen,
  MyTicketsScreen,
  MyEventsScreen,
} from '../screens';
import TagIcon from '../../images/Tag.svg';
import TicketIcon from '../../images/Ticket.svg';
import ClipboardIcon from '../../images/ClipboardAdd.svg';
import { RootTabParamList } from '../../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
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
        component={AvailableEventsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <TicketIcon color={color} width={size} height={size} />
          ),
        }}
        name={ROUTES.TAB.MY_TICKETS}
        component={MyTicketsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <ClipboardIcon color={color} width={size} height={size} />
          ),
        }}
        name={ROUTES.TAB.MY_EVENTS}
        component={MyEventsScreen}
      />
    </Tab.Navigator>
  );
}
