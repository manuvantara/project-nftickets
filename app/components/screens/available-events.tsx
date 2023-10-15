import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import EventCard from '../event';
import { RootTabScreenProps } from '../../types/navigation';
import { ROUTES } from '../../constants/routes';
import useUmi from '../../hooks/use-umi';
import {
  fetchMetadatasByUris,
  fetchUrisByMintList,
} from '../../utils/metaplex/nft-retrieval';
import { publicKey } from '@metaplex-foundation/umi';
import { isEvent } from '../../utils/helpers/type-guards';
import { Event } from '../../utils/types';

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
  const eventsList = [
    '5bkozebdDcdYhLNZVUXMhKyG422ybfZy3wY2nV35JzLh',
    'AXiwZHnVQJN9VnuF2BxLsg29rzgPaBRfjqjo1u3P97cL',
    'EtsN7cvqBQW3gGj5f55CFiGe2yVUTrQ2wrpBDKNbVLiX',
    'wYR5wUtk6V1BdXQqBmUVs7YRBZQjvVzMHfEMZiRPkue',
    'DgQY8ag2BsvZU3sDMtSPgJ6wDnM2SGxLXfZDr97hSU55',
    'Cofbbs7Mgvjz8M9LyyBhEyDYJG2mMYn7Qj4tUJ5ByfSf',
    '135ZtKsHCa6ESrJfmvqYkCs5bwGGa9aKi3CaX8yq4C5j',
    '7FAbQvi7z6pFsCXDoEo6iFoX7raVDw7omdR3YDaukqCN',
    '3EvbbDrgva3QQhzVzZsfKDo2EyB1oDNJxNT1f7Px3dJ8',
    'CtrY5F2JqDrqMdmxZ1kT4naXCQYGeoYRqH9jxr8gJULc',
    'Gd1ZmsDdhG7VWJxmP1D4vU3yahrkPUYAaNwRr1ceSTVh',
    'DH9N8ovFhuvhRfCF8dmSXUXJavRZeJDKnPA3vVQqAGBP',
    'NvsiJkPzAx4k2EiSt15fiMhcfzHNcpCkcyQhvmgNWWN',
    'ByGd6WmSQw9jC4MJhckJPR4bSdvnoK6NDsTRZUUKxowZ',
    '6hQCkUd5CHQJKeYSwWAVPochR1KkUDcsf3Q4gzrkukXB',
    'HWn4z7FXuGdrue6wjcqfTUhhQgHooKPiUEnpJ4gCKxJC',
    '25SxGK4D8nyFHdPTKzcZiTVyTQBtaT4rA3XZS2dKa9yz',
    '3MXToKsUgTPJmvD63isvz3LoLmW3S8T1nAYpyDQ3ReW9',
  ];

  const umi = useUmi();
  useEffect(() => {
    async function getMyTickets() {
      try {
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
        console.error(
          'Error fetching my tickets or corresponding events',
          error,
        );
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
