import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CreateNewEvent from '../create-new-event';
import EventCard from '../event';
import useUmi from '../../hooks/use-umi';
import { type Event } from '../../utils/types';
import {
  fetchEventsByOwner,
  fetchMetadatasByUris,
} from '../../utils/metaplex/nft-retrieval';
import { NftMetadata } from '../../utils/types';

export default function MyEventsScreen() {
  const [myEvents, setMyEvents] = useState<Event[]>();
  const umi = useUmi();

  useEffect(() => {
    async function getMyEvents() {
      try {
        const eventAssets = await fetchEventsByOwner(umi);
        console.log(eventAssets.map(eventAsset => eventAsset.mint.publicKey));
        const eventUris = eventAssets.map(event => event.metadata.uri);
        const eventMetadatas = await fetchMetadatasByUris(eventUris);

        const events = eventMetadatas.map(
          (eventMetadata: NftMetadata, index: number) => ({
            title: eventMetadata.name,

            cover: eventMetadata.properties.files[0].uri,
            image: eventMetadata.image,

            timestamp: Number(eventMetadata.attributes[0].value) * 1000,
            link: eventMetadata.external_url,

            publicKey: eventAssets[index].mint.publicKey,
          }),
        );
        const filteredEvents = events.filter(event => event.title !== '');

        setMyEvents(filteredEvents);
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
