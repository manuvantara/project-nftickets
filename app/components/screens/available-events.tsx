import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import EventCard from '../event';

const MOCK_EVENT = {
  cover: 'https://picsum.photos/200',
  title: 'Atlass Weekend 2023',
  date: '2023-04-23',
};

const numColumns = 2;
const gap = 16;

export default function AvailableEventsScreen() {
  return (
    <View style={s.container}>
      <FlatList
        data={[MOCK_EVENT, MOCK_EVENT, MOCK_EVENT]}
        contentContainerStyle={s.listContainer}
        numColumns={numColumns}
        keyExtractor={item => `${item.title}-${item.date}`}
        style={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item, index }) => (
          <View style={index % 2 === 0 ? { paddingRight: gap } : {}}>
            <EventCard
              size="small"
              onPress={() => console.log('pressed')}
              {...item}
            />
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  listContainer: {
    paddingTop: 24,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 24,
  },
  list: {
    width: '100%',
  },
});
