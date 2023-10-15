import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MontserratSemiBold } from './text';
import { COLORS } from '../constants/theme';
import ArrowLeft from '../images/AltArrowLeft.svg';

type Props = {
  title?: string;
};

export default function Header({title}: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[s.header, , { paddingTop: insets.top + 8 }]}>
      <Pressable style={s.backButton} onPress={() => navigation?.goBack()}>
        <Shadow distance={4} style={s.backButton}>
          <ArrowLeft width={24} height={24} />
        </Shadow>
      </Pressable>
      <MontserratSemiBold style={s.title}>{title}</MontserratSemiBold>
      {/* We need this empty view, so the title will be centered */}
      <View style={s.emptyView} />
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  emptyView: {
    width: 40,
    height: 40,
  }
});
