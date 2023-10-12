import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  Header,
  LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  CANDY_MACHINE_PARAMS,
  NFT,
  SOME_CANDY_MACHINE,
  SOME_NFT_COLLECTION,
} from './src/utils/placeholders';
import { AUTHORITY_PRIVATE_KEY } from '@env';
import {
  fetchNfts,
  getNftMetadataByUri,
  getTicketEventPairsByOwner,
  getTicketsByEvent,
} from './src/utils/nft-tools/nft-retrieval';
import {
  insertNfts,
  createCandyMachine,
  mintNft,
} from './src/utils/nft-tools/core';
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';

// initialize umi
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine());

// use authority wallet to sign transactions
const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(AUTHORITY_PRIVATE_KEY)),
);
const authority = createSignerFromKeypair(umi, authorityKeypair);
umi.use(keypairIdentity(authority));

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Metaplex">
            <Button
              onPress={() =>
                createCandyMachine(umi, authority, CANDY_MACHINE_PARAMS)
              }
              title="Create event"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={() =>
                insertNfts(umi, SOME_CANDY_MACHINE, Array(5).fill(NFT))
              }
              title="Create tickets"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={() => fetchNfts(umi, SOME_CANDY_MACHINE)}
              title="Fetch tickets"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={() =>
                mintNft(
                  umi,
                  authority.publicKey,
                  SOME_CANDY_MACHINE,
                  authority.publicKey,
                )
              }
              title="Buy Ticket"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </Section>
          <Section title="Fetch Functions">
            <Button
              onPress={() => getTicketsByEvent(umi, SOME_NFT_COLLECTION)}
              title="Get Tickets By Event"
              color="#007515"
              accessibilityLabel="Learn more about this green button"
            />
            <Button
              onPress={() =>
                getTicketEventPairsByOwner(
                  umi,
                  publicKey('FSLGMiNAfKAszf6M3zyEVZaZx3mA5ZeQJYBkeAzfKEVm'),
                )
              }
              title="Get Tickets By Owner"
              color="#007515"
              accessibilityLabel="Learn more about this green button"
            />
            {/* <Button
              onPress={() =>
                getNftMetadataByUri([
                  'https://jsonplaceholder.typicode.com/photos/1',
                  'https://jsonplaceholder.typicode.com/photos/2',
                  'https://jsonplaceholder.typicode.com/photos/3',
                ])
              }
              title="Get NFT Metadata"
              color="#007515"
              accessibilityLabel="Learn more about this green button"
            /> */}
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
