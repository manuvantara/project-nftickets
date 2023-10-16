import React from 'react';
import { Text, type TextProps } from 'react-native';

export function MontserratRegular(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontFamily: 'Montserrat-Regular', letterSpacing: -0.17 },
      ]}>
      {props.children}
    </Text>
  );
}

export function MontserratMedium(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontFamily: 'Montserrat-Medium', letterSpacing: -0.17 },
      ]}>
      {props.children}
    </Text>
  );
}

export function MontserratSemiBold(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontFamily: 'Montserrat-SemiBold', letterSpacing: -0.17 },
      ]}>
      {props.children}
    </Text>
  );
}

export function MontserratBold(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontFamily: 'Montserrat-Bold', letterSpacing: -0.17 },
      ]}>
      {props.children}
    </Text>
  );
}
