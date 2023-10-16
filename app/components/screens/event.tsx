import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../header';

export default function EventScreen() {
  return (
    <ScrollView style={s.container} stickyHeaderIndices={[0]}>
      <Header />
      <Text>Event</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
