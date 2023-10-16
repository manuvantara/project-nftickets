import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import EventCard from '../event';
import { RootTabScreenProps } from '../../types/navigation';
import { ROUTES } from '../../constants/routes';
import useUmi from '../../hooks/use-umi';
import {
  fetchCandyMachineByEvent,
  fetchMetadatasByUris,
  fetchUrisByMintList,
} from '../../utils/metaplex/nft-retrieval';
import { publicKey } from '@metaplex-foundation/umi';
import { isEvent } from '../../utils/helpers/type-guards';
import { Event } from '../../utils/types';
import { insertNfts } from '../../utils/metaplex/core';
import { NFT } from '../../utils/placeholders';

const MOCK_EVENT = {
  cover: 'https://picsum.photos/200',
  title: 'Atlass Weekend 2023',
  date: 1231231231234000,
};

const numColumns = 2;
const gap = 16;

export default function AvailableEventsScreen({
  navigation,
}: RootTabScreenProps<'Available Events'>) {
  const [events, setEvents] = useState<Event[]>();

  const umi = useUmi();
  useEffect(() => {
    async function getMyTickets() {
      try {
        const response = await fetch(
          'https://available-events-api.onrender.com/events',
        );
        const eventsList = (await response.json()).events.eventPublicKeys;

        const eventUris = await fetchUrisByMintList(
          umi,
          eventsList.map(event => publicKey(event)),
        );
        const eventMetadatas = await fetchMetadatasByUris(eventUris);
        if (!eventMetadatas.every(isEvent))
          throw new Error('Encountered wrong event format.');
        const events = eventMetadatas.map((eventMetadata, index) => ({
          title: eventMetadata.name,
          cover: eventMetadata.properties.files[0].uri,
          image: eventMetadata.image,
          timestamp: Number(eventMetadata.attributes[0].value) * 1000,
          link: eventMetadata.external_url,
          publicKey: publicKey(eventsList[index]),
        }));
        const filteredEvents = events.filter(event => event.title !== '');
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching avaliable events', error);
      }
    }
    getMyTickets();
  }, []);

  return (
    <View style={s.container}>
      <FlatList
        data={events}
        contentContainerStyle={s.listContainer}
        numColumns={numColumns}
        keyExtractor={item => item.publicKey.toString()}
        style={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item, index }) => (
          <View style={index % 2 === 0 ? { paddingRight: gap } : {}}>
            <EventCard
              size="small"
              onPress={() =>
                navigation.navigate(ROUTES.TICKET, {
                  title: item.title,
                  image: item.image,
                  timestamp: item.timestamp,
                  link: item.link,
                  publicKey: item.publicKey,
                  ticket: {
                    publicKey: publicKey(
                      '3MXToKsUgTPJmvD63isvz3LoLmW3S8T1nAYpyDQ3ReW9',
                    ),
                    bought: false,
                  },
                  cover: item.cover,
                })
              }
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
