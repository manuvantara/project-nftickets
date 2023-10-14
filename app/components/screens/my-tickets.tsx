import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import EventCard, { EventCard as EventCardProps } from '../event';
import useUmi from '../../hooks/use-umi';
import {
  fetchMetadatasByUris,
  fetchTicketEventPairsByOwner,
  fetchUrisByMintList,
} from '../../utils/metaplex/nft-retrieval';
import { NftMetadata } from '../../utils/types';

export default function MyTicketsScreen() {
  const [events, setEvents] = useState<EventCardProps[]>();
  const umi = useUmi();

  useEffect(() => {
    async function getMyTickets() {
      try {
        const ticketEventPairs = await fetchTicketEventPairsByOwner(umi);
        if (!ticketEventPairs) return;

        const eventUris = await fetchUrisByMintList(
          umi,
          ticketEventPairs.events,
        );
        if (!eventUris) return;

        const eventMetadatas = await fetchMetadatasByUris(eventUris);
        if (!eventMetadatas) return;

        const events = eventMetadatas.map(
          (eventMetadata: NftMetadata, index: number) => ({
            cover: eventMetadata.image,
            title: eventMetadata.name,
            date: Number(eventMetadata.attributes?.[0]?.value) * 1000 ?? 0,
            publicKey: ticketEventPairs.events[index],
          }),
        );
        const filteredEvents = events.filter(event => event.title !== '');

        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching my tickets:', error);
      }
    }
    getMyTickets();
  }, []);

  return (
    <View style={s.container}>
      <FlatList
        data={events}
        contentContainerStyle={s.listContainer}
        style={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
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
