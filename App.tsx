/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type { PropsWithChildren } from 'react';
import React from 'react';
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
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  addConfigLines,
  CandyMachineItem,
  ConfigLine,
  create,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
  createNft,
  mplTokenMetadata,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  PublicKey,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

import { env } from './utils/env';
import {
  CANDY_MACHINE_PARAMS,
  NFT,
  SOME_CANDY_MACHINE,
} from './utils/placeholders';
import { CandyMachineParams, NftMetadata } from './utils/types';

// initialize umi
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine());

// use authority wallet to sign transactions
const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
  env.authority.privateKey,
);
const authority = createSignerFromKeypair(umi, authorityKeypair);
umi.use(keypairIdentity(authority));

async function waitForTransaction(signature: Uint8Array) {
  let transaction;
  while (!transaction) {
    try {
      transaction = await umi.rpc.getTransaction(signature);
    } catch (error) {
      console.error('Error retrieving transaction:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return transaction;
}

async function mintNftCollection(
  nftMetadata: NftMetadata,
): Promise<PublicKey | undefined> {
  try {
    // const [nftCollectionImageUri] = await umi.uploader.upload([imageFile])
    // const [nftCollectionBannerUri] = await umi.uploader.upload([bannerFile])
    //const nftCollectionUri = await umi.uploader.uploadJson(nftMetadata);
    const nftCollectionUri = 'someUri';
    console.log('NFT Collection metadata uploaded to ', nftCollectionUri);

    const collectionMint = generateSigner(umi);
    const { signature } = await createNft(umi, {
      mint: collectionMint,
      authority: authority,
      name: nftMetadata.name,
      uri: nftCollectionUri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: true,
    }).sendAndConfirm(umi);
    await waitForTransaction(signature);

    console.log(
      `NFT Collection minted to https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`,
    );

    return collectionMint.publicKey;
  } catch (error) {
    console.error('Error generating NFT collection:', error);
  }
}

async function createCandyMachine(
  candyMachineParams: CandyMachineParams,
): Promise<PublicKey | undefined> {
  try {
    const collectionMintPublicKey = await mintNftCollection(
      candyMachineParams.metadata,
    );

    const candyMachine = generateSigner(umi);
    const { signature } = await (
      await create(umi, {
        candyMachine,
        collectionMint: publicKey(collectionMintPublicKey!),
        collectionUpdateAuthority: authority,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(0),
        itemsAvailable: candyMachineParams.itemsAvailable,
        creators: [
          {
            address: authority.publicKey,
            verified: true,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: '#$ID+1$',
          nameLength: 0,
          prefixUri: `https://s3.${env.aws.bucket.region}.amazonaws.com/${env.aws.bucket.name}/`,
          uriLength: 20,
          isSequential: false,
        }),
        guards: {
          solPayment: some({
            lamports: sol(candyMachineParams.pricePerToken),
            destination: candyMachineParams.treasury,
          }),
          startDate: some({ date: candyMachineParams.startDate }),
        },
      })
    ).sendAndConfirm(umi);
    await waitForTransaction(signature);

    console.log(
      `The Candy machine was created at https://explorer.solana.com/address/${candyMachine.publicKey}?cluster=devnet`,
    );

    return candyMachine.publicKey;
  } catch (error) {
    console.error('Error creating candy machine:', error);
  }
}

async function insertNfts(
  candyMachinePublicKey: PublicKey,
  nfts: ConfigLine[],
) {
  try {
    console.log('Inserting NFTs...');

    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    const { signature } = await addConfigLines(umi, {
      candyMachine: candyMachine.publicKey,
      index: candyMachine.itemsLoaded,
      configLines: nfts,
    }).sendAndConfirm(umi);
    waitForTransaction(signature);

    console.log(`Successfully inserted ${nfts.length} NFTs`);
  } catch (error) {
    console.error('Error inserting NFTs:', error);
  }
}

async function fetchNfts(
  candyMachinePublicKey: PublicKey,
): Promise<CandyMachineItem[] | undefined> {
  try {
    console.log('Fetching NFTs...');

    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    console.log(candyMachine.items);
    // candyMachine.items.forEach((item) => {
    //   console.log(`
    //     Minted ${item.minted}
    //     Item ${item.name}
    //     URI ${item.uri}
    //   `);
    // });

    return candyMachine.items;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
  }
}

async function mintNft(
  candyMachinePublicKey: PublicKey,
  treasury: PublicKey,
): Promise<PublicKey | undefined> {
  try {
    console.log('Minting NFT...');
    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    const nftMint = generateSigner(umi);
    const { signature } = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          nftMint: nftMint,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: authority.publicKey,
          mintArgs: {
            solPayment: some({ destination: treasury }),
          },
        }),
      )
      .sendAndConfirm(umi);
    waitForTransaction(signature);

    console.log(
      `Successfully minted an NFT to https://explorer.solana.com/address/${nftMint.publicKey}?cluster=devnet$`,
    );

    return nftMint.publicKey;
  } catch (error) {
    console.error('Error minting NFT:', error);
  }
}

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
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <Section title="Metaplex">
            <Button
              onPress={() => createCandyMachine(CANDY_MACHINE_PARAMS)}
              title="Create event"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={() => insertNfts(SOME_CANDY_MACHINE, Array(5).fill(NFT))}
              title="Create tickets"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={() => fetchNfts(SOME_CANDY_MACHINE)}
              title="Fetch tickets"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={() => mintNft(SOME_CANDY_MACHINE, authority.publicKey)}
              title="Buy Ticket"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
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
