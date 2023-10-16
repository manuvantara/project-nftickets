import type { CreateEventParamList } from '../../types/navigation';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../../constants/routes';
import { CreateEventScreen, CreateTicketScreen } from '../screens';
import { publicKey } from '@metaplex-foundation/umi';

const Stack = createNativeStackNavigator<CreateEventParamList>();

export default function CreateEventNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.CREATE_EVENT.CREATE_TICKET}
      screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen
        name={ROUTES.CREATE_EVENT.CREATE}
        component={CreateEventScreen}
      />
      <Stack.Screen
        name={ROUTES.CREATE_EVENT.CREATE_TICKET}
        component={CreateTicketScreen}
        initialParams={{
          eventPublicKey: publicKey(
            'EDrVGHFYX3g8UpLZnwJ5g8jP9pXMBbysAefWoVaQAdwZ',
          ),
        }}
      />
    </Stack.Navigator>
  );
}
