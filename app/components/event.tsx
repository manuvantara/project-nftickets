import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Shadow } from 'react-native-shadow-2';
import { MontserratMedium } from './text';
import { COLORS } from '../constants/theme';

type Props = {
  cover: string;
  title: string;
  date: string;
};

export default function EventCard({ cover, date, title }: Props) {
  return (
    <Shadow
      style={s.container}
      paintInside={false}
      distance={4}
      startColor="rgba(0, 0, 0, 0.15)">
      <FastImage
        source={{ uri: cover }}
        resizeMode={FastImage.resizeMode.cover}
        style={s.cover}
      />
      <View style={s.footer}>
        <MontserratMedium style={s.title}>{title}</MontserratMedium>
        <MontserratMedium style={s.date}>{date}</MontserratMedium>
      </View>
    </Shadow>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'stretch',
    borderRadius: 8,
    minHeight: 192,
    width: '100%',
  },
  coverContainer: {
    width: '100%',
    height: 140,
  },
  cover: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    flex: 1,
    width: null,
    height: null,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  date: {
    fontSize: 16,
    color: COLORS.greyA,
  },
});
