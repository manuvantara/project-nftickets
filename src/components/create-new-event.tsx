import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './button';
import CanvasImage from '../images/Canvas.svg';

export default function CreateNewEvent() {
  return (
    <View style={s.container}>
      <CanvasImage />
      <Button style={s.button} onPress={() => console.log('pressed')}>
        Create new event
      </Button>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
  button: {
    marginTop: 'auto',
  },
});
