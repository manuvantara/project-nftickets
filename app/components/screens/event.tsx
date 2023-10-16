import React from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Header from '../header';
import { Shadow } from 'react-native-shadow-2';
import { COLORS } from '../../constants/theme';
import FastImage from 'react-native-fast-image';
import { MontserratMedium, MontserratSemiBold } from '../text';
import { ExternalLink } from '../external-link';
import ArrowRightUp from '../../images/ArrowRightUp.svg';
import { uriToPath } from '../../utils/helpers/uri-to-path';
import { timestampToDate } from '../../utils/helpers/timestamp-to-date';

const screenWidth = Dimensions.get('window').width;

const numColumns = 3; // Number of columns in your grid

const gap = 10; // Adjust the gap size as needed
const itemWidth = (screenWidth - (numColumns + 1) * gap) / numColumns; // Adjust as per your requirements

const FAKE_EVENT = {
  title: 'This is a fake event',
  image: 'https://picsum.photos/200',
  link: 'https://atlasfestival.com/',
  timestamp: 0,
};

const FAKE_EVENT_TICKETS = [
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },

  {
    image: 'https://picsum.photos/200',
    timestamp: 0,
  },
];

export default function EventScreen() {
  return (
    <View style={s.container}>
      <Header />
      <View style={s.content}>
        <Shadow distance={4} style={s.topCard}>
          <FastImage
            style={s.topCardImage}
            source={{ uri: uriToPath(FAKE_EVENT.image) }}
          />
          <View>
            <MontserratMedium style={s.topCardTitle}>
              {FAKE_EVENT.title}
            </MontserratMedium>
            <MontserratMedium style={s.topCardDate}>
              {timestampToDate(FAKE_EVENT.timestamp)}
            </MontserratMedium>
          </View>
          <ExternalLink url={FAKE_EVENT.link}>
            <ArrowRightUp width={32} height={32} />
          </ExternalLink>
        </Shadow>

        <View style={{ marginTop: 48 }}>
          <MontserratSemiBold style={s.title}>
            {FAKE_EVENT.title}
          </MontserratSemiBold>

          <FlatList
            style={{ marginTop: 24 }}
            data={FAKE_EVENT_TICKETS}
            numColumns={3}
            contentContainerStyle={{
              paddingBottom: 120,
              justifyContent: 'center',
            }}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item, index }) => (
              <View
                style={
                  index % 3 === 0 || index % 3 === 1
                    ? { paddingRight: gap }
                    : {}
                }>
                <Shadow distance={4} style={s.card}>
                  <FastImage
                    resizeMode="cover"
                    style={s.cardImage}
                    source={{ uri: FAKE_EVENT.image }}
                  />
                  <MontserratMedium style={s.cardDate}>
                    {timestampToDate(FAKE_EVENT_TICKETS[0].timestamp)}
                  </MontserratMedium>
                </Shadow>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  topCard: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCardImage: {
    width: 64,
    height: 64,
    borderRadius: 64,
    marginRight: 16,
  },
  topCardTitle: {
    color: COLORS.black,
    fontSize: 16,
  },
  topCardDate: {
    color: COLORS.greyA,
    fontSize: 16,
  },
  topCardArrow: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: 20,
    color: COLORS.black,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  cardImage: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    height: 80,
    width: 100,
  },
  cardDate: {
    margin: 16,
    fontSize: 16,
    color: COLORS.greyA,
  },
});
