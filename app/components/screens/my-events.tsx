import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CreateNewEvent from '../create-new-event';
import EventCard from '../event';

const MOCK_EVENT = {
  cover: 'https://picsum.photos/200',
  title: 'Atlass Weekend 2023',
  date: '2023-04-23',
};

export default function MyEventsScreen() {
  return (
    <View style={s.container}>
      <FlatList
        data={[MOCK_EVENT, MOCK_EVENT, MOCK_EVENT]}
        contentContainerStyle={s.listContainer}
        style={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        ListEmptyComponent={<CreateNewEvent />}
        renderItem={({ item }) => <EventCard {...item} />}
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
