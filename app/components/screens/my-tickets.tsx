import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import EventCard from '../event';
import useUmi from '../../hooks/use-umi';
import {
  fetchMetadatasByUris,
  fetchTicketEventPairsByOwner,
  fetchUrisByMintList,
} from '../../utils/metaplex/nft-retrieval';
import { type EventWithTicket, NftMetadata } from '../../utils/types';
import { ROUTES } from '../../constants/routes';

export default function MyTicketsScreen({ navigation }) {
  const [events, setEvents] = useState<EventWithTicket[]>();
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
            title: eventMetadata.name,

            cover: eventMetadata.properties?.files?.[0]?.uri ?? '',
            image: eventMetadata.image,

            timestamp: Number(eventMetadata.attributes?.[0]?.value) * 1000 ?? 0,
            link: eventMetadata.external_url,

            publicKey: ticketEventPairs.events[index],
            ticket: {
              publicKey: ticketEventPairs.tickets[index],
            },
          }),
        );
        const filteredEvents = events.filter(event => event.title !== '');

        console.log(filteredEvents);

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
        renderItem={({ item }) => (
          <EventCard
            onPress={() =>
              navigation.navigate(ROUTES.TICKET, {
                title: item.title,
                image: item.image,
                timestamp: item.timestamp,
                link: item.link,
                ticket: {
                  publicKey: item.ticket.publicKey,
                },
              })
            }
            {...item}
          />
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
