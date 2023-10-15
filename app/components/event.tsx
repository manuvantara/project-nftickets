import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Shadow } from 'react-native-shadow-2';
import { MontserratMedium } from './text';
import { COLORS } from '../constants/theme';
import sv, { VariantProps } from 'style-variants';
import { timestampToDate } from '../utils/helpers/timestamp-to-date';
import { type Event } from '../utils/types';
import { uriToPath } from '../utils/helpers/uri-to-path';

type CardVariantsProps = VariantProps<typeof card>;

type CardProps = CardVariantsProps &
  TouchableOpacityProps &
  Omit<Event, 'publicKey' | 'image'>;
const card = sv({
  base: {
    borderRadius: 8,
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'white',
      },
    },
    size: {
      small: {
        minHeight: 192,
        flex: 1,
        width: 160,
      },
      large: {
        minHeight: 192,
        width: '100%',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'large',
  },
});

export default function EventCard({
  cover,
  timestamp,
  title,
  size,
  variant,
  ...rest
}: CardProps) {
  const cardStyles = card({
    variant: variant,
    size: size,
  });

  const footerSidePadding = size === 'small' ? 16 : 24;
  const footerDirection = size === 'small' ? 'column' : 'row';
  const gap = size === 'small' ? 8 : 0;

  return (
    <TouchableOpacity activeOpacity={0.8} {...rest}>
      <Shadow
        style={cardStyles}
        paintInside={false}
        distance={4}
        startColor="rgba(0, 0, 0, 0.15)">
        <FastImage
          source={{ uri: uriToPath(cover) }}
          resizeMode={FastImage.resizeMode.cover}
          style={s.cover}
        />
        <View
          style={[
            s.footer,
            {
              paddingLeft: footerSidePadding,
              paddingRight: footerSidePadding,
              flexDirection: footerDirection,
              gap,
            },
          ]}>
          <MontserratMedium style={s.title}>{title}</MontserratMedium>
          <MontserratMedium style={s.date}>
            {timestampToDate(timestamp)}
          </MontserratMedium>
        </View>
      </Shadow>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  cover: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    flex: 1,
    width: null,
    height: null,
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: COLORS.greyA,
  },
});
