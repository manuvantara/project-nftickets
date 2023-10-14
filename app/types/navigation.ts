import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ROUTES } from '../constants/routes';
import { type EventWithTicket } from '../utils/types';

export type RootStackParamList = {
  [ROUTES.TAB.INDEX]: undefined;
  [ROUTES.TICKET]: EventWithTicket;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  [ROUTES.TAB.AVAILABLE_EVENTS]: undefined;
  [ROUTES.TAB.MY_EVENTS]: undefined;
  [ROUTES.TAB.MY_TICKETS]: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    StackScreenProps<RootStackParamList>
  >;
