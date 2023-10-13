import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import CreateNewEvent from '../create-new-event';
import EventCard, { EventCardProps } from '../event';
import {
  fetchMyEvents,
  fetchNftsMetadata,
} from '../../utils/metaplex/nft-retrieval';
import useUmi from '../../hooks/use-umi';
import { NftMetadata } from '../../utils/types';

export default function MyEventsScreen() {
  const [myEvents, setEvents] = useState<EventCardProps[]>();
  const { umi } = useUmi();

  useEffect(() => {
    async function getMyEvents() {
      try {
        const myEventAssets = await fetchMyEvents(umi);
        if (!myEventAssets) return;

        const eventUris = myEventAssets.map(event => event.metadata.uri);
        console.log(eventUris);
        const eventMetadatas = await fetchNftsMetadata(eventUris);
        if (!eventMetadatas) return;

        const events = eventMetadatas.map((eventMetadata: NftMetadata) => ({
          cover: eventMetadata.image,
          title: eventMetadata.name,
          date: eventMetadata.attributes[0].value,
        }));

        setEvents(events);
      } catch (error) {
        console.error('Error fetching my events:', error);
      }
    }

    getMyEvents();
  }, [umi]);

  return (
    <View style={s.container}>
      <FlatList
        data={myEvents}
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
