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

type CardVariantsProps = VariantProps<typeof card>;

type CardProps = CardVariantsProps &
  TouchableOpacityProps & {
    cover: string;
    title: string;
    date: string;
  };

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
  date,
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

  // day month year 12.12.22
  const formattedDate = new Date(date)
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '.');

  return (
    <TouchableOpacity activeOpacity={0.8} {...rest}>
      <Shadow
        style={cardStyles}
        paintInside={false}
        distance={4}
        startColor="rgba(0, 0, 0, 0.15)">
        <FastImage
          source={{ uri: cover }}
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
          <MontserratMedium style={s.date}>{formattedDate}</MontserratMedium>
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
