import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { ROUTES } from '../constants/routes';
import ScannerIcon from '../images/Scanner.svg';
import AddCircleIcon from '../images/AddCircle.svg';
import { COLORS } from '../constants/theme';
import { MontserratSemiBold } from './text';

export default function TabHeader({ route, navigation }: BottomTabHeaderProps) {
  const { navigate } = navigation;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        s.container,
        {
          paddingTop: insets.top + 16,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}>
      <Shadow
        paintInside={false}
        distance={4}
        safeRender={true}
        startColor="rgba(0, 0, 0, 0.15)">
        <Pressable onPress={() => navigate(ROUTES.QR_SCANNER)} style={s.button}>
          <ScannerIcon color="black" width={24} height={24} />
        </Pressable>
      </Shadow>
      <MontserratSemiBold style={s.title}>{route.name}</MontserratSemiBold>
      <Shadow
        containerStyle={{
          opacity: ROUTES.TAB.MY_EVENTS === route.name ? 1 : 0,
        }}
        paintInside={false}
        distance={4}
        safeRender={true}
        startColor="rgba(0, 0, 0, 0.15)">
        <Pressable
          onPress={() => navigate(ROUTES.CREATE_EVENT.INDEX)}
          style={s.button}>
          <AddCircleIcon color="black" width={28} height={28} />
        </Pressable>
      </Shadow>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
});
